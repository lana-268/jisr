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

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'production' ? '/api' : '')).replace(/\/$/, '');
const providerId = import.meta.env.VITE_DEV_PROVIDER_ID || 'prov_1';
const headers = { 'Content-Type': 'application/json', 'x-user-id': providerId, 'x-user-role': 'PROVIDER' };
const apiRequest = async <Value>(path: string, init?: RequestInit): Promise<Value> => {
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers: { ...headers, ...init?.headers } });
  const payload = await response.json() as { data?: Value; message?: string };
  if (!response.ok) throw new Error(payload.message || `API request failed: ${response.status}`);
  return payload.data as Value;
};

class ApiProviderRepository implements ProviderRepository {
  async getCurrentProvider() {
    const result = await apiRequest<{ profile: Provider }>('/users/me');
    return result.profile;
  }
  async getProviders() { return [await this.getCurrentProvider()]; }
  async getProducts(providerIdToLoad: string) { const items = await apiRequest<{ products: ProductItem[] }>('/providers/my-items'); return items.products.filter((item) => item.providerId === providerIdToLoad); }
  async getServices(providerIdToLoad: string) { const items = await apiRequest<{ services: ServiceItem[] }>('/providers/my-items'); return items.services.filter((item) => item.providerId === providerIdToLoad); }
  async getOrders() { return apiRequest<Order[]>('/providers/orders'); }
  async updateProvider(_providerId: string, _changes: Pick<Provider, 'businessName' | 'email' | 'phone' | 'district'>): Promise<Provider> { throw new Error('Provider profile editing is not available in the backend yet.'); }
  async createProduct(input: Omit<ProductItem, 'productId' | 'createdAt'>) { return apiRequest<ProductItem>('/providers/products', { method: 'POST', body: JSON.stringify(input) }); }
  async updateProduct(productId: string, changes: Partial<ProductItem>) { if (changes.isAvailable !== undefined) return apiRequest<{ item: ProductItem }>(`/providers/items/${productId}/availability`, { method: 'PATCH' }).then((result) => result.item); throw new Error('Product editing is not available in the backend yet.'); }
  async deleteProduct(productId: string) { await apiRequest(`/providers/items/${productId}`, { method: 'DELETE' }); }
  async createService(input: Omit<ServiceItem, 'serviceId' | 'createdAt'>) { return apiRequest<ServiceItem>('/providers/services', { method: 'POST', body: JSON.stringify(input) }); }
  async updateService(serviceId: string, changes: Partial<ServiceItem>) { if (changes.isAvailable !== undefined) return apiRequest<{ item: ServiceItem }>(`/providers/items/${serviceId}/availability`, { method: 'PATCH' }).then((result) => result.item); throw new Error('Service editing is not available in the backend yet.'); }
  async deleteService(serviceId: string) { await apiRequest(`/providers/items/${serviceId}`, { method: 'DELETE' }); }
  async updateOnlineStatus() { await apiRequest('/providers/toggle-online', { method: 'PATCH' }); }
  async updateOrderStatus(orderId: string, status: OrderStatus) { await apiRequest(`/providers/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
}

export const providerRepository: ProviderRepository = apiBaseUrl ? new ApiProviderRepository() : new MockProviderRepository();
