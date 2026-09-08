import { db } from '../config/firebase.js';
import {
  Order,
  Chat,
  Message,
  CreateOrderDTO,
  OrderWithDetails,
  Provider,
  Product,
  Service,
} from '../types/index.js';
import { AppError } from '../middlewares/error.middleware.js';

export class OrderService {
  /**
   * Create order and auto-initialize a chat entry in 'chats' collection
   */
  async createOrder(customerId: string, dto: CreateOrderDTO): Promise<{ order: Order; chat: Chat }> {
    if (!dto.productId && !dto.serviceId) {
      throw new AppError('Sipariş için productId veya serviceId belirtilmelidir.', 400);
    }

    let providerId = dto.providerId;
    let totalPrice = 0;
    let itemTitle = '';

    if (dto.productId) {
      const productDoc = await db.collection('products').doc(dto.productId).get();
      if (!productDoc.exists) {
        throw new AppError('Sipariş edilmek istenen ürün bulunamadı.', 404);
      }
      const product = productDoc.data() as Product;
      if (!product.isAvailable) {
        throw new AppError('Bu ürün şu anda stokta veya satışta değil.', 400);
      }
      providerId = product.providerId;
      totalPrice = product.price;
      itemTitle = product.title;
    } else if (dto.serviceId) {
      const serviceDoc = await db.collection('services').doc(dto.serviceId).get();
      if (!serviceDoc.exists) {
        throw new AppError('Sipariş edilmek istenen hizmet bulunamadı.', 404);
      }
      const service = serviceDoc.data() as Service;
      if (!service.isAvailable) {
        throw new AppError('Bu hizmet şu anda müsait değil.', 400);
      }
      providerId = service.providerId;
      totalPrice = service.price;
      itemTitle = service.title;
    }

    if (!providerId) {
      throw new AppError('Geçerli bir hizmet sağlayıcı tespit edilemedi.', 400);
    }

    // Verify provider status
    const providerDoc = await db.collection('providers').doc(providerId).get();
    if (!providerDoc.exists) {
      throw new AppError('Hizmet sağlayıcı bulunamadı.', 404);
    }
    const provider = providerDoc.data() as Provider;
    if (provider.status !== 'APPROVED') {
      throw new AppError('Hizmet sağlayıcı henüz onaylanmamış veya askıya alınmış.', 400);
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const order: Order = {
      orderId,
      productId: dto.productId,
      serviceId: dto.serviceId,
      customerId,
      providerId,
      totalPrice,
      status: 'PENDING',
      createdAt: now,
    };

    await db.collection('orders').doc(orderId).set(order);

    // Auto-initialize or locate chat entry in 'chats' collection
    const existingChatQuery = await db
      .collection('chats')
      .where('customerId', '==', customerId)
      .where('providerId', '==', providerId)
      .get();

    let chat: Chat;
    const initialMessageText = `Yeni sipariş oluşturuldu: "${itemTitle}" (${totalPrice} TL). Sipariş No: ${orderId}${
      dto.note ? `\nNot: ${dto.note}` : ''
    }`;

    if (!existingChatQuery.empty) {
      const existingDoc = existingChatQuery.docs[0];
      const existingData = existingDoc.data() as Chat;
      chat = {
        ...existingData,
        lastMessage: initialMessageText,
        updatedAt: now,
      };
      await db.collection('chats').doc(existingData.chatId).update({
        lastMessage: initialMessageText,
        updatedAt: now,
      });
    } else {
      const chatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      chat = {
        chatId,
        customerId,
        providerId,
        lastMessage: initialMessageText,
        updatedAt: now,
      };
      await db.collection('chats').doc(chatId).set(chat);
    }

    // Create initial message in sub-collection chats/{chatId}/messages
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const message: Message = {
      messageId,
      chatId: chat.chatId,
      senderId: customerId,
      senderRole: 'CUSTOMER',
      text: initialMessageText,
      createdAt: now,
    };

    await db.collection('chats').doc(chat.chatId).collection('messages').doc(messageId).set(message);

    return { order, chat };
  }

  /**
   * Fetch order history for the logged-in customer
   */
  async getCustomerOrders(customerId: string): Promise<OrderWithDetails[]> {
    const snap = await db.collection('orders').where('customerId', '==', customerId).get();
    const orders = snap.docs.map((d: any) => d.data() as Order);

    const enrichedOrders: OrderWithDetails[] = await Promise.all(
      orders.map(async (ord: Order) => {
        let provider: Provider | undefined;
        let product: Product | undefined;
        let service: Service | undefined;

        if (ord.providerId) {
          const pDoc = await db.collection('providers').doc(ord.providerId).get();
          if (pDoc.exists) provider = pDoc.data() as Provider;
        }

        if (ord.productId) {
          const prodDoc = await db.collection('products').doc(ord.productId).get();
          if (prodDoc.exists) product = prodDoc.data() as Product;
        }

        if (ord.serviceId) {
          const servDoc = await db.collection('services').doc(ord.serviceId).get();
          if (servDoc.exists) service = servDoc.data() as Service;
        }

        return {
          ...ord,
          provider,
          product,
          service,
        };
      })
    );

    return enrichedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const orderService = new OrderService();
