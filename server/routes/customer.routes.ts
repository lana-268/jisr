import { Router } from 'express';
import { getCustomerOrders } from '../controllers/order.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/customers/orders (Fetch order history for the logged-in customer)
router.get('/orders', authenticate, requireRole('CUSTOMER'), getCustomerOrders);

export default router;
