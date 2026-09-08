import { Router } from 'express';
import { registerCustomer, registerProvider } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  registerCustomerSchema,
  registerProviderSchema,
} from '../validation/schemas.js';

const router = Router();

// POST /api/auth/register-customer
router.post('/register-customer', validateRequest(registerCustomerSchema), registerCustomer);

// POST /api/auth/register-provider (default status: 'PENDING_APPROVAL', isOnline: true)
router.post(
  '/register-provider',
  validateRequest(registerProviderSchema),
  registerProvider
);

export default router;
