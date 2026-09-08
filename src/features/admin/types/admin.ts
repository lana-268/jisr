import type { Order, Provider } from '../../../types';

export type AdminRole = 'SUPER_ADMIN' | 'SUPPORT_ADMIN';
export type CustomerAccountStatus = 'ACTIVE' | 'BLOCKED';

export interface AdminProfile {
  adminId: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AdminCustomer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  status: CustomerAccountStatus;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface AdminOrder extends Order {
  providerName: string;
}

export interface AdminStatistics {
  totalCustomers: number;
  activeProviders: number;
  pendingProviders: number;
  liveOrders: number;
}

export interface AdminDashboardSnapshot {
  profile: AdminProfile;
  customers: AdminCustomer[];
  providers: Provider[];
  orders: AdminOrder[];
}

export type AdminToast = {
  message: string;
  tone: 'success' | 'error';
};
