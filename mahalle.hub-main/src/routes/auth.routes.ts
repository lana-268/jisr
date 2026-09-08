import { Router } from 'express';
import { registerCustomer, registerProvider } from '../controllers/auth.controller.js';
import { validateRequiredFields } from '../middlewares/validate.middleware.js';

const router = Router();

// POST /api/auth/register-customer
router.post('/register-customer', validateRequiredFields(['name', 'email']), registerCustomer);

// POST /api/auth/register-provider (default status: 'PENDING_APPROVAL', isOnline: true)
router.post(
  '/register-provider',
  validateRequiredFields(['businessName', 'email', 'phone', 'providerType', 'district']),
  registerProvider
);

export default router;
