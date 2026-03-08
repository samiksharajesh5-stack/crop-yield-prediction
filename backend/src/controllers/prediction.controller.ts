import { Response } from 'express';
import { db } from '../db';
import { predictions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';
import { spawn } from 'child_process';
import path from 'path';
import axios from 'axios';

const runPython = (input: object): Promise<any> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../ml/predict.py');
    const proc = spawn('python', [scriptPath], { timeout: 30000 });
    let out = '', err = '';
    proc.stdout.on('data', (d) => out += d.toString());
    proc.stderr.on('data', (d) => err += d.toString());
    proc.on('close', (code) => {
      try {
        const result = JSON.parse(out.trim());
        resolve(result);
      } catch {
        // Try python if python not found
        const proc2 = spawn('python', [scriptPath], { timeout: 30000 });
        let o2 = '';
        proc2.stdin.write(JSON.stringify(input));
        proc2.stdin.end();
        proc2.stdout.on('data', (d) => o2 += d.toString());
        proc2.on('close', () => {
          try { resolve(JSON.parse(o2.trim())); }
          catch { reject(new Error('Python prediction failed: ' + err)); }
        });
        proc2.on('error', reject);
      }
    });
    proc.stdin.write(JSON.stringify(input));
    proc.stdin.end();
    proc.on('error', reject);
  });
};

const getWeather = async (location: string) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === 'your_openweather_api_key_here') return null;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${key}&units=metric`;
    const { data } = await axios.get(url, { timeout: 5000 });
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.['1h'] ?? data.rain?.['3h'] ?? 0,
    };
  } catch { return null; }
};

export const createPrediction = async (req: AuthRequest, res: Response) => {
  try {
    const { location, crop_type, soil_type, fertilizer, area, temperature, rainfall, humidity } = req.body;
    if (!location || !crop_type || !soil_type || !fertilizer || !area) {
      return res.status(400).json({ error: 'location, crop_type, soil_type, fertilizer and area are required' });
    }
    let weather = { temperature: 25, rainfall: 100, humidity: 70 };
    if (temperature !== undefined) {
      weather = { temperature: Number(temperature), rainfall: Number(rainfall || 100), humidity: Number(humidity || 70) };
    } else {
      const live = await getWeather(location);
      if (live) weather = live;
    }
    const input = { ...weather, soil_type, crop_type, fertilizer, area: Number(area) };
    const result = await runPython(input);
    if (!result.success) return res.status(500).json({ error: result.error || 'Prediction failed' });

    const [pred] = await db.insert(predictions).values({
      user_id:         req.user!.id,
      location,
      temperature:     String(weather.temperature),
      rainfall:        String(weather.rainfall),
      humidity:        String(weather.humidity),
      soil_type,
      crop_type,
      fertilizer,
      area:            String(area),
      predicted_yield: String(result.predicted_yield),
      total_yield:     String(result.total_yield),
      yield_category:  result.yield_category,
    }).returning();

    return res.status(201).json({ prediction: pred, result });
  } catch (err: any) {
    console.error('Prediction error:', err.message);
    return res.status(500).json({ error: 'Prediction failed: ' + err.message });
  }
};

export const getUserPredictions = async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(predictions)
      .where(eq(predictions.user_id, req.user!.id))
      .orderBy(predictions.created_at);
    return res.json(rows.reverse());
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

export const updateActualYield = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { actual_yield, notes } = req.body;
    const [updated] = await db.update(predictions)
      .set({ actual_yield: String(actual_yield), notes })
      .where(eq(predictions.id, id))
      .returning();
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update' });
  }
};
