import { Router } from 'express';
import { getServiceCategories, getProductCategories } from '../controllers/catalog.controller.js';

const router = Router();

// GET /api/categories/services (Fetch all active service categories)
router.get('/services', getServiceCategories);

// GET /api/categories/products (Fetch all active product categories)
router.get('/products', getProductCategories);

export default router;
