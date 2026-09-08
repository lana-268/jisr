import type { ProviderStatus } from '../../../types';
import { mockAdminCustomers, mockAdminOrders, mockAdminProfile, mockAdminProviders } from './mockAdminData';
import type { AdminCustomer, AdminDashboardSnapshot, AdminOrder, CustomerAccountStatus } from '../types/admin';

export interface AdminRepository {
  getDashboard(): Promise<AdminDashboardSnapshot>;
  updateCustomerStatus(customerId: string, status: CustomerAccountStatus): Promise<AdminCustomer>;
  updateProviderStatus(providerId: string, status: Extract<ProviderStatus, 'APPROVED' | 'BLOCKED'>): Promise<AdminDashboardSnapshot['providers'][number]>;
}

export interface MockAdminRepositoryOptions {
  delayMs?: number;
}

const copyCustomer = (customer: AdminCustomer): AdminCustomer => ({ ...customer });
const copyProvider = (provider: AdminDashboardSnapshot['providers'][number]): AdminDashboardSnapshot['providers'][number] => ({ ...provider });
const copyOrder = (order: AdminOrder): AdminOrder => ({ ...order });

export function createMockAdminRepository({ delayMs = 180 }: MockAdminRepositoryOptions = {}): AdminRepository {
  let customers = mockAdminCustomers.map(copyCustomer);
  let providers = mockAdminProviders.map(copyProvider);
  const orders = mockAdminOrders.map(copyOrder);
  const delay = <T,>(value: T): Promise<T> => new Promise((resolve) => window.setTimeout(() => resolve(value), delayMs));

  return {
    async getDashboard() {
      return delay({
        profile: { ...mockAdminProfile },
        customers: customers.map(copyCustomer),
        providers: providers.map(copyProvider),
        orders: orders.map(copyOrder),
      });
    },
    async updateCustomerStatus(customerId, status) {
      const current = customers.find((customer) => customer.customerId === customerId);
      if (!current) throw new Error('Customer account could not be found.');
      const updated = { ...current, status };
      customers = customers.map((customer) => customer.customerId === customerId ? updated : customer);
      return delay(copyCustomer(updated));
    },
    async updateProviderStatus(providerId, status) {
      const current = providers.find((provider) => provider.providerId === providerId);
      if (!current) throw new Error('Provider account could not be found.');
      const updated = {
        ...current,
        status,
        isOnline: status === 'BLOCKED' ? false : current.isOnline,
        approvedByAdminId: status === 'APPROVED' ? mockAdminProfile.adminId : current.approvedByAdminId,
      };
      providers = providers.map((provider) => provider.providerId === providerId ? updated : provider);
      return delay(copyProvider(updated));
    },
  };
}

export const adminRepository = createMockAdminRepository();
