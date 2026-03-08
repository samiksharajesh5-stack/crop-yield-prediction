import { Response } from 'express';
import { db } from '../db';
import { predictions, users } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(predictions).where(eq(predictions.user_id, req.user!.id));
    const total = rows.length;
    const avgYield = total > 0 ? rows.reduce((s, r) => s + parseFloat(String(r.predicted_yield)), 0) / total : 0;
    const excellent = rows.filter(r => r.yield_category === 'EXCELLENT').length;
    const good      = rows.filter(r => r.yield_category === 'GOOD').length;
    const monthly: Record<string, number> = {};
    rows.forEach(r => {
      const m = new Date(r.created_at).toLocaleString('default', { month: 'short', year: '2-digit' });
      monthly[m] = (monthly[m] || 0) + 1;
    });
    const cropDist: Record<string, number> = {};
    rows.forEach(r => { cropDist[r.crop_type] = (cropDist[r.crop_type] || 0) + 1; });
    return res.json({
      summary: { total, avgYield: avgYield.toFixed(2), excellent, good },
      monthlyTrend: Object.entries(monthly).map(([month, count]) => ({ month, count })),
      cropDistribution: Object.entries(cropDist).map(([crop, count]) => ({ crop, count })),
      scatterData: rows.slice(0, 50).map(r => ({
        predicted: parseFloat(String(r.predicted_yield)),
        actual: r.actual_yield ? parseFloat(String(r.actual_yield)) : null,
        crop: r.crop_type,
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Analytics error' });
  }
};

export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const allPreds = await db.select().from(predictions);
    const allUsers = await db.select().from(users);
    const total      = allPreds.length;
    const avgYield   = total > 0 ? allPreds.reduce((s, r) => s + parseFloat(String(r.predicted_yield)), 0) / total : 0;
    const cropDist: Record<string, number> = {};
    allPreds.forEach(r => { cropDist[r.crop_type] = (cropDist[r.crop_type] || 0) + 1; });
    return res.json({
      overview: { totalPredictions: total, totalUsers: allUsers.length, avgYield: avgYield.toFixed(2) },
      cropDistribution: Object.entries(cropDist).map(([crop, count]) => ({ crop, count })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Admin analytics error' });
  }
};

export const getAdminUsers = async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role, location: users.location, created_at: users.created_at }).from(users);
    return res.json(rows);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getAdminPredictions = async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(predictions).orderBy(predictions.created_at);
    return res.json(rows.reverse());
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(users).where(eq(users.id, id));
    return res.json({ message: 'User deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const id   = parseInt(req.params.id);
    const role = req.body.role as 'admin' | 'user';
    const [updated] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update role' });
  }
};

export const deletePrediction = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(predictions).where(eq(predictions.id, id));
    return res.json({ message: 'Prediction deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete prediction' });
  }
};
