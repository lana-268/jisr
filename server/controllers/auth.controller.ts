import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { catchAsync } from '../middlewares/error.middleware.js';
import type {
  RegisterCustomerInput,
  RegisterProviderInput,
} from '../validation/schemas.js';

export const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as RegisterCustomerInput;
  const customer = await authService.registerCustomer(input, req.user?.uid);
  res.status(201).json({
    success: true,
    message: 'Müşteri kaydı başarıyla oluşturuldu.',
    data: customer,
  });
});

export const registerProvider = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as RegisterProviderInput;
  const provider = await authService.registerProvider(input, req.user?.uid);
  res.status(201).json({
    success: true,
    message: 'Hizmet sağlayıcı kaydı başarıyla oluşturuldu. Yönetici onayı bekleniyor.',
    data: provider,
  });
});
