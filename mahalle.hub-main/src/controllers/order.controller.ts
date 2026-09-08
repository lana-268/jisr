import { Request, Response } from 'express';
import { orderService } from '../services/order.service.js';
import { catchAsync } from '../middlewares/error.middleware.js';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.uid;
  const result = await orderService.createOrder(customerId, req.body);

  res.status(201).json({
    success: true,
    message: 'Sipariş başarıyla oluşturuldu ve mesajlaşma başlatıldı.',
    data: result,
  });
});

export const getCustomerOrders = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.uid;
  const orders = await orderService.getCustomerOrders(customerId);

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});
