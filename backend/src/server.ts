import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CropAI API', time: new Date().toISOString() });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`✅ CropAI server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Database: ${process.env.DATABASE_URL ? 'Connected (Neon)' : '⚠️  No DATABASE_URL set'}`);
});
