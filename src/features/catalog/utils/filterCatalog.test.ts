import { describe, expect, it } from 'vitest';
import { catalogProductCategories, catalogProducts, catalogProviders, catalogServiceCategories, catalogServices } from '../data/mockCatalogData';
import { filterCatalog } from './filterCatalog';

const source = { providers: catalogProviders, products: catalogProducts, services: catalogServices, productCategories: catalogProductCategories, serviceCategories: catalogServiceCategories };
const filter = (changes = {}) => filterCatalog(source, { district: '', search: '', track: 'ALL', categoryId: null, ...changes });
describe('catalog eligibility and filtering', () => {
  it('shows only approved, online, available listings', () => { const ids = filter().map(({ item }) => 'productId' in item ? item.productId : item.serviceId); expect(ids).not.toContain('cp-11'); expect(ids).not.toContain('cp-12'); expect(ids).not.toContain('cs-8'); expect(ids).not.toContain('cs-9'); });
  it('filters by district', () => expect(filter({ district: 'Kadıköy' }).every(({ provider }) => provider.district === 'Kadıköy')).toBe(true));
  it('filters product and service tracks', () => { expect(filter({ track: 'PRODUCTS' }).every(({ kind }) => kind === 'product')).toBe(true); expect(filter({ track: 'SERVICES' }).every(({ kind }) => kind === 'service')).toBe(true); });
  it('filters category and search across provider metadata', () => { expect(filter({ categoryId: 'food-desserts' }).every(({ item }) => 'productCategoryId' in item && item.productCategoryId === 'food-desserts')).toBe(true); expect(filter({ search: 'Mehmet' }).every(({ provider }) => provider.businessName.includes('Mehmet'))).toBe(true); });
});
