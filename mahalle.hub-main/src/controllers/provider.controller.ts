import { Request, Response } from 'express';
import { providerService } from '../services/provider.service.js';
import { catchAsync, AppError } from '../middlewares/error.middleware.js';
import { OrderStatus } from '../types/index.js';

export const toggleOnline = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const provider = await providerService.toggleOnline(providerId);

  res.status(200).json({
    success: true,
    message: `Durum başarıyla güncellendi: ${provider.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}`,
    data: { isOnline: provider.isOnline },
  });
});

export const getMyItems = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const items = await providerService.getMyItems(providerId);

  res.status(200).json({
    success: true,
    data: items,
  });
});

export const addProduct = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const product = await providerService.addProduct(providerId, req.body);

  res.status(201).json({
    success: true,
    message: 'Ürün başarıyla eklendi.',
    data: product,
  });
});

export const addService = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const service = await providerService.addService(providerId, req.body);

  res.status(201).json({
    success: true,
    message: 'Hizmet başarıyla eklendi.',
    data: service,
  });
});

export const toggleItemAvailability = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const { itemId } = req.params;
  const result = await providerService.toggleItemAvailability(providerId, itemId);

  res.status(200).json({
    success: true,
    message: `Öğe durumu güncellendi: ${result.item.isAvailable ? 'Müsait/Satışta' : 'Müsait Değil'}`,
    data: result,
  });
});

export const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const { itemId } = req.params;
  const result = await providerService.deleteItem(providerId, itemId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const orders = await providerService.getProviderOrders(providerId);

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.uid;
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses: OrderStatus[] = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  if (!status || !validStatuses.includes(status)) {
    throw new AppError(`Geçersiz sipariş durumu. Geçerli durumlar: ${validStatuses.join(', ')}`, 400);
  }

  const updatedOrder = await providerService.updateOrderStatus(providerId, orderId, status);

  res.status(200).json({
    success: true,
    message: `Sipariş durumu "${status}" olarak güncellendi.`,
    data: updatedOrder,
  });
});
