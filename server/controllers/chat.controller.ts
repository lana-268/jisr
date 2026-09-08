import { Request, Response } from 'express';
import { chatService } from '../services/chat.service.js';
import { catchAsync } from '../middlewares/error.middleware.js';
import { SenderRole } from '../types/index.js';
import type { SendMessageInput } from '../validation/schemas.js';

export const getMyChats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.uid;
  const role = req.user!.role;
  const chats = await chatService.getMyChats(userId, role);

  res.status(200).json({
    success: true,
    count: chats.length,
    data: chats,
  });
});

export const getChatMessages = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.uid;
  const role = req.user!.role;
  const { chatId } = req.params;

  const messages = await chatService.getChatMessages(chatId, userId, role);

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.uid;
  const role = req.user!.role as SenderRole;
  const { chatId } = req.params;
  const { text } = req.body as SendMessageInput;

  const message = await chatService.sendMessage(chatId, userId, role, text);

  res.status(201).json({
    success: true,
    message: 'Mesaj başarıyla gönderildi.',
    data: message,
  });
});
