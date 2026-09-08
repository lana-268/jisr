import type { ProductCategory, ProductItem, Provider, ServiceCategory, ServiceItem } from '../../../types';
import { catalogProductCategories, catalogProducts, catalogProviders, catalogServiceCategories, catalogServices } from './mockCatalogData';

export interface CatalogRepository { getProviders(): Promise<Provider[]>; getProductCategories(): Promise<ProductCategory[]>; getServiceCategories(): Promise<ServiceCategory[]>; getProducts(): Promise<ProductItem[]>; getServices(): Promise<ServiceItem[]> }
const delay = () => new Promise<void>((resolve) => window.setTimeout(resolve, 260));
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' || import.meta.env.MODE === 'development' ? '/api' : '');
const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, '');

const request = async <Value>(path: string): Promise<Value> => {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const payload = await response.json() as { data: Value };
  return payload.data;
};

export class MockCatalogRepository implements CatalogRepository {
  constructor(private fail = false) {}
  private async result<Value>(value: Value): Promise<Value> { await delay(); if (this.fail) throw new Error('Marketplace unavailable'); return structuredClone(value); }
  getProviders() { return this.result(catalogProviders); } getProductCategories() { return this.result(catalogProductCategories); }
  getServiceCategories() { return this.result(catalogServiceCategories); } getProducts() { return this.result(catalogProducts); } getServices() { return this.result(catalogServices); }
}

export class ApiCatalogRepository implements CatalogRepository {
  async getProviders() {
    const [products, services] = await Promise.all([this.getProducts(), this.getServices()]);
    return [...products, ...services].reduce<Provider[]>((providers, entry) => providers.some((provider) => provider.providerId === entry.provider.providerId) ? providers : [...providers, entry.provider], []);
  }
  async getProductCategories() { return request<ProductCategory[]>('/categories/products'); }
  async getServiceCategories() { return request<ServiceCategory[]>('/categories/services'); }
  async getProducts() { return (await request<Array<{ item: ProductItem; provider: Provider }>>('/catalog/products')).map(({ item }) => item); }
  async getServices() { return (await request<Array<{ item: ServiceItem; provider: Provider }>>('/catalog/services')).map(({ item }) => item); }
}

export const catalogRepository: CatalogRepository = apiBaseUrl ? new ApiCatalogRepository() : new MockCatalogRepository();
