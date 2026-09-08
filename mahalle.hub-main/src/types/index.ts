// Strict String Union Types (avoiding regular TypeScript enums as specified)
export type AdminType = 'SUPER_ADMIN' | 'SUPPORT_ADMIN';
export type ProviderType = 'HOME_PRODUCT' | 'GENERAL_SERVICE';
export type ProviderStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED';
export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type SenderRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type ItemType = 'PRODUCT' | 'SERVICE';

// Firestore Collection Models
export interface Admin {
  adminId: string;
  name: string;
  email: string;
  adminType: AdminType;
  createdByAdminId?: string;
  createdAt: string;
}

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  district?: string;
  createdAt: string;
}

export interface Provider {
  providerId: string;
  businessName: string;
  email: string;
  phone: string;
  providerType: ProviderType;
  status: ProviderStatus;
  isOnline: boolean;
  approvedByAdminId?: string;
  district: string;
  createdAt: string;
}

export interface ServiceCategory {
  serviceCategoryId: string;
  name: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface ProductCategory {
  productCategoryId: string;
  name: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface Product {
  productId: string;
  providerId: string;
  productCategoryId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface Service {
  serviceId: string;
  providerId: string;
  serviceCategoryId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface Order {
  orderId: string;
  productId?: string;
  serviceId?: string;
  customerId: string;
  providerId: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Chat {
  chatId: string;
  customerId: string;
  providerId: string;
  assignedAdminId?: string;
  lastMessage?: string;
  updatedAt: string;
}

export interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  senderRole: SenderRole;
  text: string;
  createdAt: string;
}

// Enriched types for API responses
export interface CatalogItemWithProvider {
  item: (Product & { itemType: 'PRODUCT' }) | (Service & { itemType: 'SERVICE' });
  provider: Pick<Provider, 'providerId' | 'businessName' | 'district' | 'phone' | 'email' | 'isOnline' | 'status'>;
  category?: ProductCategory | ServiceCategory;
}

export interface OrderWithDetails extends Order {
  product?: Product;
  service?: Service;
  customer?: Customer;
  provider?: Provider;
}

export interface ChatWithDetails extends Chat {
  customer?: Pick<Customer, 'customerId' | 'name' | 'email' | 'phone'>;
  provider?: Pick<Provider, 'providerId' | 'businessName' | 'district'>;
}

// Authenticated User Context
export interface AuthUser {
  uid: string;
  email?: string;
  role: UserRole;
  adminType?: AdminType;
}

// Request Body DTOs
export interface RegisterCustomerDTO {
  customerId?: string; // If using Firebase Auth UID or auto-generated
  name: string;
  email: string;
  phone?: string;
  district?: string;
}

export interface RegisterProviderDTO {
  providerId?: string; // If using Firebase Auth UID or auto-generated
  businessName: string;
  email: string;
  phone: string;
  providerType: ProviderType;
  district: string;
}

export interface CreateProductDTO {
  productCategoryId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface CreateServiceDTO {
  serviceCategoryId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface CreateOrderDTO {
  productId?: string;
  serviceId?: string;
  providerId?: string;
  note?: string;
}

export interface SendMessageDTO {
  text: string;
}

export interface CreateSupportAdminDTO {
  name: string;
  email: string;
}
