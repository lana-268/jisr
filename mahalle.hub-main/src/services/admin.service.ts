import { db } from '../config/firebase.js';
import {
  Provider,
  Admin,
  ProviderStatus,
  CreateSupportAdminDTO,
  ChatWithDetails,
  Chat,
  Customer,
} from '../types/index.js';
import { AppError } from '../middlewares/error.middleware.js';

export class AdminService {
  /**
   * Fetch all providers waiting for approval
   */
  async getPendingProviders(): Promise<Provider[]> {
    const snap = await db.collection('providers').where('status', '==', 'PENDING_APPROVAL').get();
    return snap.docs.map((d: any) => d.data() as Provider);
  }

  /**
   * Fetch all providers with optional status filter
   */
  async getProviders(status?: ProviderStatus): Promise<Provider[]> {
    let query = db.collection('providers');
    if (status) {
      query = query.where('status', '==', status);
    }
    const snap = await query.get();
    return snap.docs.map((d: any) => d.data() as Provider);
  }

  /**
   * Update provider status to 'APPROVED' or 'BLOCKED'
   */
  async updateProviderStatus(
    providerId: string,
    status: 'APPROVED' | 'BLOCKED',
    adminId: string
  ): Promise<Provider> {
    if (status !== 'APPROVED' && status !== 'BLOCKED') {
      throw new AppError("Geçersiz durum. Sadece 'APPROVED' veya 'BLOCKED' seçilebilir.", 400);
    }

    const providerRef = db.collection('providers').doc(providerId);
    const doc = await providerRef.get();

    if (!doc.exists) {
      throw new AppError('Hizmet sağlayıcı bulunamadı.', 404);
    }

    const provider = doc.data() as Provider;
    const updateData: Partial<Provider> = {
      status,
      approvedByAdminId: status === 'APPROVED' ? adminId : provider.approvedByAdminId,
    };

    await providerRef.update(updateData);
    return { ...provider, ...updateData };
  }

  /**
   * SUPER_ADMIN only: list all support admin accounts
   */
  async getSupportAdmins(): Promise<Admin[]> {
    const snap = await db.collection('admins').where('adminType', '==', 'SUPPORT_ADMIN').get();
    return snap.docs.map((d: any) => d.data() as Admin);
  }

  /**
   * SUPER_ADMIN only: create new SUPPORT_ADMIN account
   */
  async createSupportAdmin(dto: CreateSupportAdminDTO, creatorAdminId: string): Promise<Admin> {
    const existingSnap = await db.collection('admins').where('email', '==', dto.email.toLowerCase()).get();
    if (!existingSnap.empty) {
      throw new AppError('Bu e-posta adresiyle kayıtlı bir yönetici hesabı zaten mevcut.', 409);
    }

    const adminId = `admin_sup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const admin: Admin = {
      adminId,
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      adminType: 'SUPPORT_ADMIN',
      createdByAdminId: creatorAdminId,
      createdAt: new Date().toISOString(),
    };

    await db.collection('admins').doc(adminId).set(admin);
    return admin;
  }

  /**
   * Support Admin monitor: fetch list of all customer-provider chats to provide assistance
   */
  async getAllChats(): Promise<ChatWithDetails[]> {
    const snap = await db.collection('chats').get();
    const chats = snap.docs.map((d: any) => d.data() as Chat);

    const enriched: ChatWithDetails[] = await Promise.all(
      chats.map(async (c: Chat) => {
        let customer: any;
        let provider: any;

        if (c.customerId) {
          const custDoc = await db.collection('customers').doc(c.customerId).get();
          if (custDoc.exists) {
            const data = custDoc.data() as Customer;
            customer = { customerId: data.customerId, name: data.name, email: data.email, phone: data.phone };
          }
        }

        if (c.providerId) {
          const provDoc = await db.collection('providers').doc(c.providerId).get();
          if (provDoc.exists) {
            const data = provDoc.data() as Provider;
            provider = { providerId: data.providerId, businessName: data.businessName, district: data.district };
          }
        }

        return {
          ...c,
          customer,
          provider,
        };
      })
    );

    return enriched.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
}

export const adminService = new AdminService();
