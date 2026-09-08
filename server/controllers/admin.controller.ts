import { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';
import { catchAsync } from '../middlewares/error.middleware.js';
import { ProviderStatus } from '../types/index.js';
import type {
  CreateSupportAdminInput,
  UpdateProviderStatusInput,
} from '../validation/schemas.js';

export const getPendingProviders = catchAsync(async (req: Request, res: Response) => {
  const providers = await adminService.getPendingProviders();
  res.status(200).json({
    success: true,
    count: providers.length,
    data: providers,
  });
});

export const getProviders = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.query;
  const providers = await adminService.getProviders(status as ProviderStatus);
  res.status(200).json({
    success: true,
    count: providers.length,
    data: providers,
  });
});

export const updateProviderStatus = catchAsync(async (req: Request, res: Response) => {
  const { providerId } = req.params;
  const { status } = req.body as UpdateProviderStatusInput;
  const adminId = req.user!.uid;

  const updatedProvider = await adminService.updateProviderStatus(providerId, status, adminId);
  res.status(200).json({
    success: true,
    message: `Hizmet sağlayıcı durumu "${status}" olarak güncellendi.`,
    data: updatedProvider,
  });
});

export const getSupportAdmins = catchAsync(async (req: Request, res: Response) => {
  const admins = await adminService.getSupportAdmins();
  res.status(200).json({
    success: true,
    count: admins.length,
    data: admins,
  });
});

export const createSupportAdmin = catchAsync(async (req: Request, res: Response) => {
  const creatorAdminId = req.user!.uid;
  const { name, email } = req.body as CreateSupportAdminInput;

  const admin = await adminService.createSupportAdmin({ name, email }, creatorAdminId);
  res.status(201).json({
    success: true,
    message: 'Destek yöneticisi hesabı başarıyla oluşturuldu.',
    data: admin,
  });
});

export const getAdminChats = catchAsync(async (req: Request, res: Response) => {
  const chats = await adminService.getAllChats();
  res.status(200).json({
    success: true,
    count: chats.length,
    data: chats,
  });
});
