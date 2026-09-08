import type { CatalogFilters, CatalogItem, ProductCategory, ProductItem, Provider, ServiceCategory, ServiceItem } from '../../../types';

export interface CatalogSource { providers: Provider[]; products: ProductItem[]; services: ServiceItem[]; productCategories: ProductCategory[]; serviceCategories: ServiceCategory[] }
export function filterCatalog(source: CatalogSource, filters: CatalogFilters): CatalogItem[] {
  const approved = new Map(source.providers.filter((provider) => provider.status === 'APPROVED' && provider.isOnline).map((provider) => [provider.providerId, provider]));
  const productNames = new Map(source.productCategories.map((category) => [category.productCategoryId, category.name]));
  const serviceNames = new Map(source.serviceCategories.map((category) => [category.serviceCategoryId, category.name]));
  const query = filters.search.trim().toLocaleLowerCase('tr-TR');
  const matches = (text: string, provider: Provider, category: string) => (!filters.district || provider.district === filters.district) && (!query || `${text} ${provider.businessName} ${category}`.toLocaleLowerCase('tr-TR').includes(query));
  const items: CatalogItem[] = [];
  if (filters.track !== 'SERVICES') for (const item of source.products) { const owner = approved.get(item.providerId); const category = productNames.get(item.productCategoryId) ?? ''; if (owner && item.isAvailable && (!filters.categoryId || filters.categoryId === item.productCategoryId) && matches(`${item.title} ${item.description ?? ''}`, owner, category)) items.push({ kind: 'product', item, provider: owner }); }
  if (filters.track !== 'PRODUCTS') for (const item of source.services) { const owner = approved.get(item.providerId); const category = serviceNames.get(item.serviceCategoryId) ?? ''; if (owner && item.isAvailable && (!filters.categoryId || filters.categoryId === item.serviceCategoryId) && matches(`${item.title} ${item.description ?? ''}`, owner, category)) items.push({ kind: 'service', item, provider: owner }); }
  return items;
}
