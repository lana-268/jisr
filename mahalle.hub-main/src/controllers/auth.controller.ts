import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { catchAsync } from '../middlewares/error.middleware.js';

export const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await authService.registerCustomer(req.body, req.user?.uid);
  res.status(201).json({
    success: true,
    message: 'Müşteri kaydı başarıyla oluşturuldu.',
    data: customer,
  });
});

export const registerProvider = catchAsync(async (req: Request, res: Response) => {
  const provider = await authService.registerProvider(req.body, req.user?.uid);
  res.status(201).json({
    success: true,
    message: 'Hizmet sağlayıcı kaydı başarıyla oluşturuldu. Yönetici onayı bekleniyor.',
    data: provider,
  });
});
