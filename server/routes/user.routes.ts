import { Router } from 'express';
import { getMe } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/users/me (Fetch profile based on UID and role: Customer, Provider, or Admin)
router.get('/me', authenticate, getMe);

export default router;
