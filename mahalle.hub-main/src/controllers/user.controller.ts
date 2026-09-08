import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { catchAsync, AppError } from '../middlewares/error.middleware.js';

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Oturum açılması gerekiyor.', 401);
  }

  const { role, profile } = await authService.getUserProfile(req.user.uid, req.user.role);

  res.status(200).json({
    success: true,
    data: {
      uid: req.user.uid,
      role,
      adminType: req.user.adminType,
      profile,
    },
  });
});
