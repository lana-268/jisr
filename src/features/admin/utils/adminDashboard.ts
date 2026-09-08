import type { OrderStatus, Provider, ProviderType } from '../../../types';
import type { AdminCustomer, AdminOrder, AdminStatistics, CustomerAccountStatus } from '../types/admin';

export const formatAdminCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);

export const formatAdminDate = (value: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

export const providerTypeName = (type: ProviderType) =>
  type === 'HOME_PRODUCT' ? 'Home food' : 'General service';

export function calculateAdminStatistics(customers: AdminCustomer[], providers: Provider[], orders: AdminOrder[]): AdminStatistics {
  return {
    totalCustomers: customers.length,
    activeProviders: providers.filter((provider) => provider.status === 'APPROVED').length,
    pendingProviders: providers.filter((provider) => provider.status === 'PENDING_APPROVAL').length,
    liveOrders: orders.filter((order) => order.status === 'PENDING' || order.status === 'IN_PROGRESS').length,
  };
}

export interface CustomerFilters {
  query: string;
  status: 'ALL' | CustomerAccountStatus;
}

export function filterCustomers(customers: AdminCustomer[], filters: CustomerFilters): AdminCustomer[] {
  const query = filters.query.trim().toLocaleLowerCase('tr-TR');
  return customers.filter((customer) => {
    const matchesStatus = filters.status === 'ALL' || customer.status === filters.status;
    const haystack = `${customer.name} ${customer.email} ${customer.district} ${customer.customerId}`.toLocaleLowerCase('tr-TR');
    return matchesStatus && (!query || haystack.includes(query));
  });
}

export interface ProviderFilters {
  query: string;
  status: 'ALL' | Provider['status'];
  type: 'ALL' | ProviderType;
}

export function filterProviders(providers: Provider[], filters: ProviderFilters): Provider[] {
  const query = filters.query.trim().toLocaleLowerCase('tr-TR');
  return providers.filter((provider) => {
    const matchesStatus = filters.status === 'ALL' || provider.status === filters.status;
    const matchesType = filters.type === 'ALL' || provider.providerType === filters.type;
    const haystack = `${provider.businessName} ${provider.email} ${provider.district} ${provider.providerId}`.toLocaleLowerCase('tr-TR');
    return matchesStatus && matchesType && (!query || haystack.includes(query));
  });
}

export interface OrderFilters {
  query: string;
  status: 'ALL' | OrderStatus;
}

export function filterAdminOrders(orders: AdminOrder[], filters: OrderFilters): AdminOrder[] {
  const query = filters.query.trim().toLocaleLowerCase('tr-TR');
  return orders.filter((order) => {
    const matchesStatus = filters.status === 'ALL' || order.status === filters.status;
    const haystack = `${order.orderId} ${order.customerName} ${order.providerName} ${order.itemTitle}`.toLocaleLowerCase('tr-TR');
    return matchesStatus && (!query || haystack.includes(query));
  });
}
