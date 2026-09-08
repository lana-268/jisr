import type { Order, OrderStatus, ProductItem, Provider, ServiceItem } from '../../../types';
import { canTransitionOrderStatus } from '../utils/dashboard';
import { mockOrders, mockProducts, mockProviders, mockServices } from './mockProviderData';

export interface ProviderRepository {
  getCurrentProvider(): Promise<Provider>;
  getProviders(): Promise<Provider[]>;
  getProducts(providerId: string): Promise<ProductItem[]>;
  getServices(providerId: string): Promise<ServiceItem[]>;
  getOrders(providerId: string): Promise<Order[]>;
  updateProvider(providerId: string, changes: Pick<Provider, 'businessName' | 'email' | 'phone' | 'district'>): Promise<Provider>;
  createProduct(input: Omit<ProductItem, 'productId' | 'createdAt'>): Promise<ProductItem>;
  updateProduct(productId: string, changes: Partial<ProductItem>): Promise<ProductItem>;
  deleteProduct(productId: string): Promise<void>;
  createService(input: Omit<ServiceItem, 'serviceId' | 'createdAt'>): Promise<ServiceItem>;
  updateService(serviceId: string, changes: Partial<ServiceItem>): Promise<ServiceItem>;
  deleteService(serviceId: string): Promise<void>;
  updateOnlineStatus(providerId: string, isOnline: boolean): Promise<void>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
}

const delay = (duration = 280) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export class MockProviderRepository implements ProviderRepository {
  private providers = structuredClone(mockProviders);
  private products = structuredClone(mockProducts);
  private services = structuredClone(mockServices);
  private orders = structuredClone(mockOrders);

  async getCurrentProvider() { await delay(); return structuredClone(this.providers[0]); }
  async getProviders() { await delay(); return structuredClone(this.providers); }
  async getProducts(providerId: string) { await delay(); return structuredClone(this.products.filter((item) => item.providerId === providerId)); }
  async getServices(providerId: string) { await delay(); return structuredClone(this.services.filter((item) => item.providerId === providerId)); }
  async getOrders(providerId: string) { await delay(); return structuredClone(this.orders.filter((item) => item.providerId === providerId)); }
  async updateProvider(providerId: string, changes: Pick<Provider, 'businessName' | 'email' | 'phone' | 'district'>) { await delay(); const index = this.providers.findIndex((item) => item.providerId === providerId); if (index < 0) throw new Error('Provider not found'); this.providers[index] = { ...this.providers[index], ...changes }; return structuredClone(this.providers[index]); }

  async createProduct(input: Omit<ProductItem, 'productId' | 'createdAt'>) {
    await delay();
    const product = { ...input, productId: `prod-${crypto.randomUUID()}`, createdAt: new Date().toISOString() };
    this.products.unshift(product);
    return structuredClone(product);
  }

  async updateProduct(productId: string, changes: Partial<ProductItem>) {
    await delay();
    const index = this.products.findIndex((item) => item.productId === productId);
    if (index < 0) throw new Error('Product not found');
    this.products[index] = { ...this.products[index], ...changes, productId };
    return structuredClone(this.products[index]);
  }

  async deleteProduct(productId: string) { await delay(); this.products = this.products.filter((item) => item.productId !== productId); }

  async createService(input: Omit<ServiceItem, 'serviceId' | 'createdAt'>) {
    await delay();
    const service = { ...input, serviceId: `serv-${crypto.randomUUID()}`, createdAt: new Date().toISOString() };
    this.services.unshift(service);
    return structuredClone(service);
  }

  async updateService(serviceId: string, changes: Partial<ServiceItem>) {
    await delay();
    const index = this.services.findIndex((item) => item.serviceId === serviceId);
    if (index < 0) throw new Error('Service not found');
    this.services[index] = { ...this.services[index], ...changes, serviceId };
    return structuredClone(this.services[index]);
  }

  async deleteService(serviceId: string) { await delay(); this.services = this.services.filter((item) => item.serviceId !== serviceId); }

  async updateOnlineStatus(providerId: string, isOnline: boolean) {
    await delay();
    const provider = this.providers.find((item) => item.providerId === providerId);
    if (!provider) throw new Error('Provider not found');
    if (isOnline && provider.status !== 'APPROVED') throw new Error('Only approved providers can go online');
    provider.isOnline = isOnline;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    await delay();
    const order = this.orders.find((item) => item.orderId === orderId);
    if (!order) throw new Error('Order not found');
    if (!canTransitionOrderStatus(order.status, status)) throw new Error('This order status change is not allowed');
    order.status = status;
  }
}

export const providerRepository: ProviderRepository = new MockProviderRepository();
