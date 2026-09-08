import { Router } from 'express';
import {
  getPendingProviders,
  getProviders,
  updateProviderStatus,
  getSupportAdmins,
  createSupportAdmin,
  getAdminChats,
} from '../controllers/admin.controller.js';
import { authenticate, requireRole, requireSuperAdmin } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createSupportAdminSchema,
  providerIdParamsSchema,
  providersQuerySchema,
  updateProviderStatusSchema,
} from '../validation/schemas.js';

const router = Router();

// Base protection: All admin routes require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/providers/pending (Fetch all providers waiting for approval)
router.get('/providers/pending', getPendingProviders);

// GET /api/admin/providers (Fetch all providers with optional status filter)
router.get('/providers', validateRequest(providersQuerySchema, 'query'), getProviders);

// PATCH /api/admin/providers/:providerId/status (Update provider status to 'APPROVED' or 'BLOCKED')
router.patch(
  '/providers/:providerId/status',
  validateRequest(providerIdParamsSchema, 'params'),
  validateRequest(updateProviderStatusSchema),
  updateProviderStatus
);

// GET /api/admin/chats (Support Admin monitor: fetch list of all customer-provider chats to provide assistance)
router.get('/chats', getAdminChats);

// SUPER_ADMIN only routes
// GET /api/admin/support-admins (SUPER_ADMIN only: list all support admin accounts)
router.get('/support-admins', requireSuperAdmin, getSupportAdmins);

// POST /api/admin/create-support-admin (SUPER_ADMIN only: create new SUPPORT_ADMIN account)
router.post(
  '/create-support-admin',
  requireSuperAdmin,
  validateRequest(createSupportAdminSchema),
  createSupportAdmin
);

export default router;
