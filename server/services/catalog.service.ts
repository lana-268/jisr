import { db } from '../config/firebase.js';
import {
  ServiceCategory,
  ProductCategory,
  Product,
  Service,
  Provider,
  CatalogItemWithProvider,
} from '../types/index.js';
import { AppError } from '../middlewares/error.middleware.js';

export class CatalogService {
  /**
   * Fetch all active service categories
   */
  async getServiceCategories(): Promise<ServiceCategory[]> {
    const snap = await db.collection('service_categories').where('isActive', '==', true).get();
    return snap.docs.map((doc: any) => doc.data() as ServiceCategory);
  }

  /**
   * Fetch all active product categories
   */
  async getProductCategories(): Promise<ProductCategory[]> {
    const snap = await db.collection('product_categories').where('isActive', '==', true).get();
    return snap.docs.map((doc: any) => doc.data() as ProductCategory);
  }

  /**
   * Helper: cache or batch-fetch approved & online providers
   */
  private async getApprovedOnlineProvidersMap(district?: string): Promise<Map<string, Provider>> {
    let query = db.collection('providers').where('status', '==', 'APPROVED').where('isOnline', '==', true);

    if (district) {
      query = query.where('district', '==', district);
    }

    const snap = await query.get();
    const providerMap = new Map<string, Provider>();
    snap.docs.forEach((d: any) => {
      const p = d.data() as Provider;
      providerMap.set(p.providerId, p);
    });
    return providerMap;
  }

  /**
   * Fetch catalog products:
   * Filter by district, productCategoryId.
   * Only return if item.isAvailable == true, provider.status == 'APPROVED', and provider.isOnline == true.
   */
  async getProducts(filters: { district?: string; productCategoryId?: string }): Promise<CatalogItemWithProvider[]> {
    const validProviders = await this.getApprovedOnlineProvidersMap(filters.district);
    if (validProviders.size === 0) {
      return [];
    }

    let query = db.collection('products').where('isAvailable', '==', true);
    if (filters.productCategoryId) {
      query = query.where('productCategoryId', '==', filters.productCategoryId);
    }

    const snap = await query.get();
    const results: CatalogItemWithProvider[] = [];

    for (const doc of snap.docs) {
      const product = doc.data() as Product;
      const provider = validProviders.get(product.providerId);
      if (provider) {
        results.push({
          item: { ...product, itemType: 'PRODUCT' },
          provider: {
            providerId: provider.providerId,
            businessName: provider.businessName,
            district: provider.district,
            phone: provider.phone,
            email: provider.email,
            isOnline: provider.isOnline,
            status: provider.status,
          },
        });
      }
    }

    return results;
  }

  /**
   * Fetch catalog services:
   * Filter by district, serviceCategoryId.
   * Only return if item.isAvailable == true, provider.status == 'APPROVED', and provider.isOnline == true.
   */
  async getServices(filters: { district?: string; serviceCategoryId?: string }): Promise<CatalogItemWithProvider[]> {
    const validProviders = await this.getApprovedOnlineProvidersMap(filters.district);
    if (validProviders.size === 0) {
      return [];
    }

    let query = db.collection('services').where('isAvailable', '==', true);
    if (filters.serviceCategoryId) {
      query = query.where('serviceCategoryId', '==', filters.serviceCategoryId);
    }

    const snap = await query.get();
    const results: CatalogItemWithProvider[] = [];

    for (const doc of snap.docs) {
      const service = doc.data() as Service;
      const provider = validProviders.get(service.providerId);
      if (provider) {
        results.push({
          item: { ...service, itemType: 'SERVICE' },
          provider: {
            providerId: provider.providerId,
            businessName: provider.businessName,
            district: provider.district,
            phone: provider.phone,
            email: provider.email,
            isOnline: provider.isOnline,
            status: provider.status,
          },
        });
      }
    }

    return results;
  }

  /**
   * Fetch single product or service details along with provider details
   */
  async getItemById(itemId: string): Promise<CatalogItemWithProvider> {
    // 1. Check if product
    const productDoc = await db.collection('products').doc(itemId).get();
    if (productDoc.exists) {
      const product = productDoc.data() as Product;
      const providerDoc = await db.collection('providers').doc(product.providerId).get();
      const provider = providerDoc.exists ? (providerDoc.data() as Provider) : null;

      if (!provider) {
        throw new AppError('Hizmet sağlayıcı bilgisine ulaşılamadı.', 404);
      }

      // Check category details if present
      let category: ProductCategory | undefined;
      if (product.productCategoryId) {
        const catDoc = await db.collection('product_categories').doc(product.productCategoryId).get();
        if (catDoc.exists) category = catDoc.data() as ProductCategory;
      }

      return {
        item: { ...product, itemType: 'PRODUCT' },
        provider: {
          providerId: provider.providerId,
          businessName: provider.businessName,
          district: provider.district,
          phone: provider.phone,
          email: provider.email,
          isOnline: provider.isOnline,
          status: provider.status,
        },
        category,
      };
    }

    // 2. Check if service
    const serviceDoc = await db.collection('services').doc(itemId).get();
    if (serviceDoc.exists) {
      const service = serviceDoc.data() as Service;
      const providerDoc = await db.collection('providers').doc(service.providerId).get();
      const provider = providerDoc.exists ? (providerDoc.data() as Provider) : null;

      if (!provider) {
        throw new AppError('Hizmet sağlayıcı bilgisine ulaşılamadı.', 404);
      }

      let category: ServiceCategory | undefined;
      if (service.serviceCategoryId) {
        const catDoc = await db.collection('service_categories').doc(service.serviceCategoryId).get();
        if (catDoc.exists) category = catDoc.data() as ServiceCategory;
      }

      return {
        item: { ...service, itemType: 'SERVICE' },
        provider: {
          providerId: provider.providerId,
          businessName: provider.businessName,
          district: provider.district,
          phone: provider.phone,
          email: provider.email,
          isOnline: provider.isOnline,
          status: provider.status,
        },
        category,
      };
    }

    throw new AppError('İstenen ürün veya hizmet bulunamadı.', 404);
  }
}

export const catalogService = new CatalogService();
