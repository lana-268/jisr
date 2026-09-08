export type ProviderType = 'HOME_PRODUCT' | 'GENERAL_SERVICE';
export type ProviderStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED';
export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Provider {
  providerId: string;
  businessName: string;
  email: string;
  phone: string;
  providerType: ProviderType;
  status: ProviderStatus;
  isOnline: boolean;
  approvedByAdminId?: string | null;
  district: string;
  createdAt: string;
}

export interface ProductCategory {
  productCategoryId: string;
  name: string;
  iconUrl?: string | null;
  isActive: boolean;
}

export interface ServiceCategory {
  serviceCategoryId: string;
  name: string;
  iconUrl?: string | null;
  isActive: boolean;
}

export interface ProductItem {
  productId: string;
  providerId: string;
  productCategoryId: string;
  title: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
}

export interface ServiceItem {
  serviceId: string;
  providerId: string;
  serviceCategoryId: string;
  title: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
}

export interface Order {
  orderId: string;
  productId?: string | null;
  serviceId?: string | null;
  customerId: string;
  // Frontend conveniences; the real backend may resolve these through related records.
  customerName: string;
  itemTitle: string;
  providerId: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface DashboardStatistics {
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  totalEarnings: number;
}

export type CatalogItem =
  | { kind: 'product'; item: ProductItem; provider: Provider }
  | { kind: 'service'; item: ServiceItem; provider: Provider };

export interface District { districtId: string; name: string }

export interface CatalogFilters {
  district: string;
  search: string;
  track: 'ALL' | 'PRODUCTS' | 'SERVICES';
  categoryId: string | null;
}
