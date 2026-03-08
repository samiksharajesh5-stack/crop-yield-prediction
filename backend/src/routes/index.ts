import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { createPrediction, getUserPredictions, updateActualYield } from '../controllers/prediction.controller';
import { getUserAnalytics, getAdminAnalytics, getAdminUsers, getAdminPredictions, deleteUser, updateUserRole, deletePrediction } from '../controllers/analytics.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login',    login);
router.get('/auth/me',        authenticate, getMe);

// Predictions
router.post('/predictions/predict', authenticate, createPrediction);
router.get('/predictions',          authenticate, getUserPredictions);
router.patch('/predictions/:id',    authenticate, updateActualYield);

// Analytics
router.get('/analytics', authenticate, getUserAnalytics);

// Admin
router.get('/admin/analytics',            authenticate, requireAdmin, getAdminAnalytics);
router.get('/admin/users',                authenticate, requireAdmin, getAdminUsers);
router.delete('/admin/users/:id',         authenticate, requireAdmin, deleteUser);
router.patch('/admin/users/:id/role',     authenticate, requireAdmin, updateUserRole);
router.get('/admin/predictions',          authenticate, requireAdmin, getAdminPredictions);
router.delete('/admin/predictions/:id',   authenticate, requireAdmin, deletePrediction);

export default router;
