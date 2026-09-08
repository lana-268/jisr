import { db } from '../config/firebase.js';
import {
  Chat,
  Message,
  ChatWithDetails,
  UserRole,
  SenderRole,
  Customer,
  Provider,
} from '../types/index.js';
import { AppError } from '../middlewares/error.middleware.js';

export class ChatService {
  /**
   * Fetch list of active chats for the logged-in user, provider, or admin
   */
  async getMyChats(userId: string, role: UserRole): Promise<ChatWithDetails[]> {
    let query;

    if (role === 'CUSTOMER') {
      query = db.collection('chats').where('customerId', '==', userId);
    } else if (role === 'PROVIDER') {
      query = db.collection('chats').where('providerId', '==', userId);
    } else {
      // ADMIN can see all active chats to monitor or assist
      query = db.collection('chats');
    }

    const snap = await query.get();
    const chats = snap.docs.map((d: any) => d.data() as Chat);

    // Enrich with customer and provider info
    const enriched: ChatWithDetails[] = await Promise.all(
      chats.map(async (c: Chat) => {
        let customer: any;
        let provider: any;

        if (c.customerId) {
          const custDoc = await db.collection('customers').doc(c.customerId).get();
          if (custDoc.exists) {
            const data = custDoc.data() as Customer;
            customer = { customerId: data.customerId, name: data.name, email: data.email, phone: data.phone };
          }
        }

        if (c.providerId) {
          const provDoc = await db.collection('providers').doc(c.providerId).get();
          if (provDoc.exists) {
            const data = provDoc.data() as Provider;
            provider = { providerId: data.providerId, businessName: data.businessName, district: data.district };
          }
        }

        return {
          ...c,
          customer,
          provider,
        };
      })
    );

    return enriched.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Fetch all messages for a specific conversation ordered by createdAt ASC
   */
  async getChatMessages(chatId: string, userId: string, role: UserRole): Promise<Message[]> {
    const chatDoc = await db.collection('chats').doc(chatId).get();
    if (!chatDoc.exists) {
      throw new AppError('Sohbet odası bulunamadı.', 404);
    }

    const chat = chatDoc.data() as Chat;

    // Security check: only participants or admin can read messages
    if (role !== 'ADMIN' && chat.customerId !== userId && chat.providerId !== userId) {
      throw new AppError('Bu sohbeti görüntüleme yetkiniz yok.', 403);
    }

    const snap = await db
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();

    return snap.docs.map((d: any) => d.data() as Message);
  }

  /**
   * Send a message and update lastMessage & updatedAt in parent chat
   */
  async sendMessage(chatId: string, senderId: string, senderRole: SenderRole, text: string): Promise<Message> {
    const chatRef = db.collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      throw new AppError('Sohbet odası bulunamadı.', 404);
    }

    const chat = chatDoc.data() as Chat;

    // Security check
    if (senderRole !== 'ADMIN' && chat.customerId !== senderId && chat.providerId !== senderId) {
      throw new AppError('Bu sohbete mesaj gönderme yetkiniz yok.', 403);
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const message: Message = {
      messageId,
      chatId,
      senderId,
      senderRole,
      text: text.trim(),
      createdAt: now,
    };

    // Store in subcollection
    await chatRef.collection('messages').doc(messageId).set(message);

    // Update parent chat document
    await chatRef.update({
      lastMessage: text.trim(),
      updatedAt: now,
    });

    return message;
  }
}

export const chatService = new ChatService();
