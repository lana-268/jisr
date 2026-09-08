import type { ProductCategory, ProductItem, Provider, ServiceCategory, ServiceItem } from '../../../types';
import { catalogProductCategories, catalogProducts, catalogProviders, catalogServiceCategories, catalogServices } from './mockCatalogData';

export interface CatalogRepository { getProviders(): Promise<Provider[]>; getProductCategories(): Promise<ProductCategory[]>; getServiceCategories(): Promise<ServiceCategory[]>; getProducts(): Promise<ProductItem[]>; getServices(): Promise<ServiceItem[]> }
const delay = () => new Promise<void>((resolve) => window.setTimeout(resolve, 260));
export class MockCatalogRepository implements CatalogRepository {
  constructor(private fail = false) {}
  private async result<Value>(value: Value): Promise<Value> { await delay(); if (this.fail) throw new Error('Marketplace unavailable'); return structuredClone(value); }
  getProviders() { return this.result(catalogProviders); } getProductCategories() { return this.result(catalogProductCategories); }
  getServiceCategories() { return this.result(catalogServiceCategories); } getProducts() { return this.result(catalogProducts); } getServices() { return this.result(catalogServices); }
}
export const catalogRepository: CatalogRepository = new MockCatalogRepository();
