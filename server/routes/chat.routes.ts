import { Router } from 'express';
import { getMyChats, getChatMessages, sendMessage } from '../controllers/chat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { chatIdParamsSchema, sendMessageSchema } from '../validation/schemas.js';

const router = Router();

// All chat routes require authentication
router.use(authenticate);

// GET /api/chats/my-chats (Fetch list of active chats for the logged-in user, provider, or admin)
router.get('/my-chats', getMyChats);

// GET /api/chats/:chatId/messages (Fetch all messages for a specific conversation ordered by createdAt ASC)
router.get('/:chatId/messages', validateRequest(chatIdParamsSchema, 'params'), getChatMessages);

// POST /api/chats/:chatId/messages (Send a message and update lastMessage & updatedAt in parent chat)
router.post(
  '/:chatId/messages',
  validateRequest(chatIdParamsSchema, 'params'),
  validateRequest(sendMessageSchema),
  sendMessage
);

export default router;
