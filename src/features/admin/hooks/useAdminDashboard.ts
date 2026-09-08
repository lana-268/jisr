import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ProviderStatus } from '../../../types';
import { adminRepository } from '../data/adminRepository';
import type { AdminRepository } from '../data/adminRepository';
import type { AdminCustomer, AdminDashboardSnapshot, AdminToast, CustomerAccountStatus } from '../types/admin';
import { calculateAdminStatistics } from '../utils/adminDashboard';

const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';

export function useAdminDashboard(repository: AdminRepository = adminRepository) {
  const [snapshot, setSnapshot] = useState<AdminDashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<AdminToast | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSnapshot(await repository.getDashboard());
    } catch (loadError: unknown) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => { void load(); }, [load]);

  const updateCustomerStatus = useCallback(async (customer: AdminCustomer, status: CustomerAccountStatus) => {
    setUpdatingId(customer.customerId);
    try {
      const updated = await repository.updateCustomerStatus(customer.customerId, status);
      setSnapshot((current) => current ? { ...current, customers: current.customers.map((item) => item.customerId === updated.customerId ? updated : item) } : current);
      setToast({ message: `${customer.name} is now ${status === 'ACTIVE' ? 'active' : 'blocked'}.`, tone: 'success' });
    } catch (updateError: unknown) {
      setToast({ message: errorMessage(updateError), tone: 'error' });
      throw updateError;
    } finally {
      setUpdatingId(null);
    }
  }, [repository]);

  const updateProviderStatus = useCallback(async (providerId: string, status: Extract<ProviderStatus, 'APPROVED' | 'BLOCKED'>) => {
    const provider = snapshot?.providers.find((item) => item.providerId === providerId);
    setUpdatingId(providerId);
    try {
      const updated = await repository.updateProviderStatus(providerId, status);
      setSnapshot((current) => current ? { ...current, providers: current.providers.map((item) => item.providerId === updated.providerId ? updated : item) } : current);
      setToast({ message: `${provider?.businessName ?? 'Provider'} ${status === 'APPROVED' ? 'approved and visible' : 'blocked'}.`, tone: 'success' });
    } catch (updateError: unknown) {
      setToast({ message: errorMessage(updateError), tone: 'error' });
      throw updateError;
    } finally {
      setUpdatingId(null);
    }
  }, [repository, snapshot?.providers]);

  const statistics = useMemo(() => snapshot ? calculateAdminStatistics(snapshot.customers, snapshot.providers, snapshot.orders) : null, [snapshot]);

  return {
    snapshot,
    statistics,
    loading,
    updatingId,
    error,
    toast,
    reload: load,
    updateCustomerStatus,
    updateProviderStatus,
    notify: (message: string) => setToast({ message, tone: 'success' }),
    clearToast: () => setToast(null),
  };
}
