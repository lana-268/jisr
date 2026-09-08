import { Request, Response } from 'express';
import { catalogService } from '../services/catalog.service.js';
import { catchAsync } from '../middlewares/error.middleware.js';

export const getServiceCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await catalogService.getServiceCategories();
  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getProductCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await catalogService.getProductCategories();
  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { district, productCategoryId } = req.query;
  const products = await catalogService.getProducts({
    district: district ? String(district) : undefined,
    productCategoryId: productCategoryId ? String(productCategoryId) : undefined,
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

export const getServices = catchAsync(async (req: Request, res: Response) => {
  const { district, serviceCategoryId } = req.query;
  const services = await catalogService.getServices({
    district: district ? String(district) : undefined,
    serviceCategoryId: serviceCategoryId ? String(serviceCategoryId) : undefined,
  });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

export const getItemById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await catalogService.getItemById(id);

  res.status(200).json({
    success: true,
    data: item,
  });
});
