import { Router } from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createOrderSchema } from '../validation/schemas.js';

const router = Router();

// POST /api/orders (Create order and auto-initialize a chat entry in 'chats' collection)
router.post(
  '/',
  authenticate,
  requireRole('CUSTOMER'),
  validateRequest(createOrderSchema),
  createOrder
);

export default router;
