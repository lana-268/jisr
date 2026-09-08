import { Router } from 'express';
import {
  toggleOnline,
  getMyItems,
  addProduct,
  addService,
  toggleItemAvailability,
  deleteItem,
  getProviderOrders,
  updateOrderStatus,
} from '../controllers/provider.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { validateRequiredFields } from '../middlewares/validate.middleware.js';

const router = Router();

// All provider endpoints require authentication and PROVIDER role
router.use(authenticate, requireRole('PROVIDER'));

// PATCH /api/providers/toggle-online (Toggle provider's isOnline status)
router.patch('/toggle-online', toggleOnline);

// GET /api/providers/my-items (Fetch all products or services belonging to the logged-in provider)
router.get('/my-items', getMyItems);

// POST /api/providers/products (Add a new home product/food)
router.post('/products', validateRequiredFields(['productCategoryId', 'title', 'price']), addProduct);

// POST /api/providers/services (Add a new service)
router.post('/services', validateRequiredFields(['serviceCategoryId', 'title', 'price']), addService);

// PATCH /api/providers/items/:itemId/availability (Toggle isAvailable for a specific product/service)
router.patch('/items/:itemId/availability', toggleItemAvailability);

// DELETE /api/providers/items/:itemId (Remove an item)
router.delete('/items/:itemId', deleteItem);

// GET /api/providers/orders (Fetch all incoming orders for this provider)
router.get('/orders', getProviderOrders);

// PATCH /api/providers/orders/:orderId/status (Update order status: IN_PROGRESS, COMPLETED, CANCELLED)
router.patch('/orders/:orderId/status', validateRequiredFields(['status']), updateOrderStatus);

export default router;
