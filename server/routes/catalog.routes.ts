import { Router } from 'express';
import { getProducts, getServices, getItemById } from '../controllers/catalog.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  catalogItemParamsSchema,
  catalogProductsQuerySchema,
  catalogServicesQuerySchema,
} from '../validation/schemas.js';

const router = Router();

// GET /api/catalog/products (Filter by district, productCategoryId)
router.get('/products', validateRequest(catalogProductsQuerySchema, 'query'), getProducts);

// GET /api/catalog/services (Filter by district, serviceCategoryId)
router.get('/services', validateRequest(catalogServicesQuerySchema, 'query'), getServices);

// GET /api/catalog/items/:id (Fetch single product or service details along with provider details)
router.get('/items/:id', validateRequest(catalogItemParamsSchema, 'params'), getItemById);

export default router;
