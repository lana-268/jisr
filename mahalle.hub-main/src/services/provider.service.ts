import { db } from '../config/firebase.js';
import {
  Provider,
  Product,
  Service,
  CreateProductDTO,
  CreateServiceDTO,
  OrderWithDetails,
  OrderStatus,
  Order,
  Customer,
} from '../types/index.js';
import { AppError } from '../middlewares/error.middleware.js';

export class ProviderService {
  /**
   * Toggle provider's isOnline status
   */
  async toggleOnline(providerId: string): Promise<Provider> {
    const providerRef = db.collection('providers').doc(providerId);
    const doc = await providerRef.get();

    if (!doc.exists) {
      throw new AppError('Hizmet sağlayıcı bulunamadı.', 404);
    }

    const currentData = doc.data() as Provider;
    const newStatus = !currentData.isOnline;

    await providerRef.update({ isOnline: newStatus });
    return { ...currentData, isOnline: newStatus };
  }

  /**
   * Fetch all products or services belonging to the logged-in provider
   */
  async getMyItems(providerId: string): Promise<{ products: Product[]; services: Service[] }> {
    const [productsSnap, servicesSnap] = await Promise.all([
      db.collection('products').where('providerId', '==', providerId).get(),
      db.collection('services').where('providerId', '==', providerId).get(),
    ]);

    const products = productsSnap.docs.map((d: any) => d.data() as Product);
    const services = servicesSnap.docs.map((d: any) => d.data() as Service);

    return { products, services };
  }

  /**
   * Add a new home product/food
   */
  async addProduct(providerId: string, dto: CreateProductDTO): Promise<Product> {
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const product: Product = {
      productId,
      providerId,
      productCategoryId: dto.productCategoryId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      price: Number(dto.price),
      imageUrl: dto.imageUrl?.trim(),
      isAvailable: dto.isAvailable ?? true,
      createdAt: new Date().toISOString(),
    };

    await db.collection('products').doc(productId).set(product);
    return product;
  }

  /**
   * Add a new service
   */
  async addService(providerId: string, dto: CreateServiceDTO): Promise<Service> {
    const serviceId = `serv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const service: Service = {
      serviceId,
      providerId,
      serviceCategoryId: dto.serviceCategoryId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      price: Number(dto.price),
      imageUrl: dto.imageUrl?.trim(),
      isAvailable: dto.isAvailable ?? true,
      createdAt: new Date().toISOString(),
    };

    await db.collection('services').doc(serviceId).set(service);
    return service;
  }

  /**
   * Toggle isAvailable for a specific product/service
   */
  async toggleItemAvailability(providerId: string, itemId: string): Promise<{ itemType: 'PRODUCT' | 'SERVICE'; item: Product | Service }> {
    // Check product first
    const productRef = db.collection('products').doc(itemId);
    const productDoc = await productRef.get();

    if (productDoc.exists) {
      const prod = productDoc.data() as Product;
      if (prod.providerId !== providerId) {
        throw new AppError('Bu ürünü düzenleme yetkiniz yok.', 403);
      }
      const updatedAvail = !prod.isAvailable;
      await productRef.update({ isAvailable: updatedAvail });
      return { itemType: 'PRODUCT', item: { ...prod, isAvailable: updatedAvail } };
    }

    // Check service
    const serviceRef = db.collection('services').doc(itemId);
    const serviceDoc = await serviceRef.get();

    if (serviceDoc.exists) {
      const serv = serviceDoc.data() as Service;
      if (serv.providerId !== providerId) {
        throw new AppError('Bu hizmeti düzenleme yetkiniz yok.', 403);
      }
      const updatedAvail = !serv.isAvailable;
      await serviceRef.update({ isAvailable: updatedAvail });
      return { itemType: 'SERVICE', item: { ...serv, isAvailable: updatedAvail } };
    }

    throw new AppError('Öğe bulunamadı.', 404);
  }

  /**
   * Remove an item (product or service)
   */
  async deleteItem(providerId: string, itemId: string): Promise<{ success: boolean; message: string }> {
    // Check product
    const productRef = db.collection('products').doc(itemId);
    const productDoc = await productRef.get();

    if (productDoc.exists) {
      const prod = productDoc.data() as Product;
      if (prod.providerId !== providerId) {
        throw new AppError('Bu ürünü silme yetkiniz yok.', 403);
      }
      await productRef.delete();
      return { success: true, message: 'Ürün başarıyla silindi.' };
    }

    // Check service
    const serviceRef = db.collection('services').doc(itemId);
    const serviceDoc = await serviceRef.get();

    if (serviceDoc.exists) {
      const serv = serviceDoc.data() as Service;
      if (serv.providerId !== providerId) {
        throw new AppError('Bu hizmeti silme yetkiniz yok.', 403);
      }
      await serviceRef.delete();
      return { success: true, message: 'Hizmet başarıyla silindi.' };
    }

    throw new AppError('Öğe bulunamadı.', 404);
  }

  /**
   * Fetch all incoming orders for this provider
   */
  async getProviderOrders(providerId: string): Promise<OrderWithDetails[]> {
    const snap = await db.collection('orders').where('providerId', '==', providerId).get();
    const orders = snap.docs.map((d: any) => d.data() as Order);

    // Enrich with customer and item details
    const enrichedOrders: OrderWithDetails[] = await Promise.all(
      orders.map(async (ord: Order) => {
        let customer: Customer | undefined;
        let product: Product | undefined;
        let service: Service | undefined;

        if (ord.customerId) {
          const cDoc = await db.collection('customers').doc(ord.customerId).get();
          if (cDoc.exists) customer = cDoc.data() as Customer;
        }

        if (ord.productId) {
          const pDoc = await db.collection('products').doc(ord.productId).get();
          if (pDoc.exists) product = pDoc.data() as Product;
        }

        if (ord.serviceId) {
          const sDoc = await db.collection('services').doc(ord.serviceId).get();
          if (sDoc.exists) service = sDoc.data() as Service;
        }

        return {
          ...ord,
          customer,
          product,
          service,
        };
      })
    );

    // Order by createdAt desc
    return enrichedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Update order status: IN_PROGRESS, COMPLETED, CANCELLED
   */
  async updateOrderStatus(providerId: string, orderId: string, status: OrderStatus): Promise<Order> {
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new AppError('Sipariş bulunamadı.', 404);
    }

    const order = orderDoc.data() as Order;
    if (order.providerId !== providerId) {
      throw new AppError('Bu siparişin durumunu değiştirme yetkiniz yok.', 403);
    }

    await orderRef.update({ status });
    return { ...order, status };
  }
}

export const providerService = new ProviderService();
