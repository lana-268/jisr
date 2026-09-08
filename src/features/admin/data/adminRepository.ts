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

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'production' ? '/api' : '')).replace(/\/$/, '');
const adminHeaders = { 'Content-Type': 'application/json', 'x-user-id': import.meta.env.VITE_DEV_ADMIN_ID || 'admin-super-1', 'x-user-role': 'ADMIN', 'x-admin-type': 'SUPER_ADMIN' };
const adminRequest = async <Value>(path: string, init?: RequestInit): Promise<Value> => {
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers: { ...adminHeaders, ...init?.headers } });
  const payload = await response.json() as { data?: Value; message?: string };
  if (!response.ok) throw new Error(payload.message || `API request failed: ${response.status}`);
  return payload.data as Value;
};

const apiAdminRepository: AdminRepository = {
  async getDashboard() {
    const providers = await adminRequest<AdminDashboardSnapshot['providers']>('/admin/providers');
    return { profile: { ...mockAdminProfile }, customers: mockAdminCustomers.map(copyCustomer), providers, orders: mockAdminOrders.map(copyOrder) };
  },
  async updateCustomerStatus() { throw new Error('Customer account management is not available in the backend yet.'); },
  async updateProviderStatus(providerId, status) { return adminRequest<AdminDashboardSnapshot['providers'][number]>(`/admin/providers/${providerId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); },
};

export const adminRepository = apiBaseUrl ? apiAdminRepository : createMockAdminRepository();
