import { Router } from 'express';
import { getProducts, getServices, getItemById } from '../controllers/catalog.controller.js';

const router = Router();

// GET /api/catalog/products (Filter by district, productCategoryId)
router.get('/products', getProducts);

// GET /api/catalog/services (Filter by district, serviceCategoryId)
router.get('/services', getServices);

// GET /api/catalog/items/:id (Fetch single product or service details along with provider details)
router.get('/items/:id', getItemById);

export default router;
