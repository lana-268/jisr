import { db } from '../config/firebase.js';
import {
  Customer,
  Provider,
  Admin,
  RegisterCustomerDTO,
  RegisterProviderDTO,
  UserRole,
} from '../types/index.js';
import { AppError } from '../middlewares/error.middleware.js';

export class AuthService {
  /**
   * Register a new customer
   */
  async registerCustomer(dto: RegisterCustomerDTO, authUid?: string): Promise<Customer> {
    const customerId = authUid || dto.customerId || `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Check if email already registered
    const existingSnap = await db.collection('customers').where('email', '==', dto.email.toLowerCase()).get();
    if (!existingSnap.empty) {
      throw new AppError('Bu e-posta adresiyle kayıtlı bir müşteri hesabı zaten mevcut.', 409);
    }

    const customer: Customer = {
      customerId,
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone?.trim(),
      district: dto.district?.trim(),
      createdAt: new Date().toISOString(),
    };

    await db.collection('customers').doc(customerId).set(customer);
    return customer;
  }

  /**
   * Register a new provider (default status: 'PENDING_APPROVAL', isOnline: true)
   */
  async registerProvider(dto: RegisterProviderDTO, authUid?: string): Promise<Provider> {
    const providerId = authUid || dto.providerId || `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Check if email already registered
    const existingSnap = await db.collection('providers').where('email', '==', dto.email.toLowerCase()).get();
    if (!existingSnap.empty) {
      throw new AppError('Bu e-posta adresiyle kayıtlı bir hizmet sağlayıcı hesabı zaten mevcut.', 409);
    }

    const provider: Provider = {
      providerId,
      businessName: dto.businessName.trim(),
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone.trim(),
      providerType: dto.providerType,
      status: 'PENDING_APPROVAL',
      isOnline: true,
      district: dto.district.trim(),
      createdAt: new Date().toISOString(),
    };

    await db.collection('providers').doc(providerId).set(provider);
    return provider;
  }

  /**
   * Get current authenticated user profile based on UID and optional role hint
   */
  async getUserProfile(uid: string, roleHint?: UserRole): Promise<{ role: UserRole; profile: Customer | Provider | Admin }> {
    // 1. Check Admins
    if (!roleHint || roleHint === 'ADMIN') {
      const adminDoc = await db.collection('admins').doc(uid).get();
      if (adminDoc.exists) {
        return { role: 'ADMIN', profile: adminDoc.data() as Admin };
      }
    }

    // 2. Check Providers
    if (!roleHint || roleHint === 'PROVIDER') {
      const providerDoc = await db.collection('providers').doc(uid).get();
      if (providerDoc.exists) {
        return { role: 'PROVIDER', profile: providerDoc.data() as Provider };
      }
    }

    // 3. Check Customers
    if (!roleHint || roleHint === 'CUSTOMER') {
      const customerDoc = await db.collection('customers').doc(uid).get();
      if (customerDoc.exists) {
        return { role: 'CUSTOMER', profile: customerDoc.data() as Customer };
      }
    }

    throw new AppError('Kullanıcı profili bulunamadı.', 404);
  }
}

export const authService = new AuthService();
