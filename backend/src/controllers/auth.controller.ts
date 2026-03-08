import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, location } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ name, email, password: hashed, location }).returning();
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location } });
  } catch (err: any) {
    console.error('Register error:', err.message);
    return res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location } });
  } catch (err: any) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user!.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role, location: user.location });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server error' });
  }
};
