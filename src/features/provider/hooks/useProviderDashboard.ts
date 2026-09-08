import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Order, OrderStatus, ProductItem, Provider, ServiceItem } from '../../../types';
import { providerRepository, type ProviderRepository } from '../data/providerRepository';
import { calculateStatistics } from '../utils/dashboard';

export type ToastState = { message: string; tone: 'success' | 'error' } | null;

export function useProviderDashboard(repository: ProviderRepository = providerRepository) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const notify = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const loadProvider = useCallback(async (nextProvider: Provider) => {
    setLoading(true);
    try {
      const [nextProducts, nextServices, nextOrders] = await Promise.all([
        repository.getProducts(nextProvider.providerId),
        repository.getServices(nextProvider.providerId),
        repository.getOrders(nextProvider.providerId),
      ]);
      setProvider(nextProvider); setProducts(nextProducts); setServices(nextServices); setOrders(nextOrders);
    } catch { notify('We could not load the dashboard. Please try again.', 'error'); }
    finally { setLoading(false); }
  }, [notify, repository]);

  useEffect(() => {
    let active = true;
    repository.getProviders().then((items) => {
      if (!active) return;
      setProviders(items);
      if (items[0]) void loadProvider(items[0]);
    }).catch(() => { if (active) { setLoading(false); notify('We could not load the providers.', 'error'); } });
    return () => { active = false; };
  }, [loadProvider, notify, repository]);

  const switchProvider = async (providerId: string) => {
    const selected = providers.find((item) => item.providerId === providerId);
    if (selected) await loadProvider(selected);
  };

  const updateOnline = async (isOnline: boolean) => {
    if (!provider) return;
    setUpdating(true);
    try {
      await repository.updateOnlineStatus(provider.providerId, isOnline);
      setProvider({ ...provider, isOnline });
      setProviders((items) => items.map((item) => item.providerId === provider.providerId ? { ...item, isOnline } : item));
      notify(isOnline ? 'You are now available for new orders.' : 'Your listings are now hidden.');
    } catch (error) { notify(error instanceof Error ? error.message : 'Availability could not be updated.', 'error'); }
    finally { setUpdating(false); }
  };
  const updateProfile = async (changes: Pick<Provider, 'businessName' | 'email' | 'phone' | 'district'>) => { if (!provider) return false; setUpdating(true); try { const saved = await repository.updateProvider(provider.providerId, changes); setProvider(saved); setProviders((items) => items.map((item) => item.providerId === saved.providerId ? saved : item)); notify('Provider profile updated.'); return true; } catch { notify('Profile could not be updated.', 'error'); return false; } finally { setUpdating(false); } };

  const saveProduct = async (values: Omit<ProductItem, 'productId' | 'createdAt'>, productId?: string) => {
    setUpdating(true);
    try {
      if (values.imageUrl?.includes('error.test')) throw new Error('Simulated connection error. Your entries were preserved.');
      if (productId) {
        const saved = await repository.updateProduct(productId, values);
        setProducts((items) => items.map((item) => item.productId === productId ? saved : item));
      } else {
        const saved = await repository.createProduct(values); setProducts((items) => [saved, ...items]);
      }
      notify(productId ? 'Product updated.' : 'Product added.'); return true;
    } catch (error) { notify(error instanceof Error ? error.message : 'Product could not be saved.', 'error'); return false; }
    finally { setUpdating(false); }
  };

  const saveService = async (values: Omit<ServiceItem, 'serviceId' | 'createdAt'>, serviceId?: string) => {
    setUpdating(true);
    try {
      if (values.imageUrl?.includes('error.test')) throw new Error('Simulated connection error. Your entries were preserved.');
      if (serviceId) {
        const saved = await repository.updateService(serviceId, values);
        setServices((items) => items.map((item) => item.serviceId === serviceId ? saved : item));
      } else {
        const saved = await repository.createService(values); setServices((items) => [saved, ...items]);
      }
      notify(serviceId ? 'Service updated.' : 'Service added.'); return true;
    } catch (error) { notify(error instanceof Error ? error.message : 'Service could not be saved.', 'error'); return false; }
    finally { setUpdating(false); }
  };

  const patchProduct = async (productId: string, changes: Partial<ProductItem>) => { setUpdating(true); try { const saved = await repository.updateProduct(productId, changes); setProducts((items) => items.map((item) => item.productId === productId ? saved : item)); notify('Product availability updated.'); } catch { notify('Product could not be updated.', 'error'); } finally { setUpdating(false); } };
  const patchService = async (serviceId: string, changes: Partial<ServiceItem>) => { setUpdating(true); try { const saved = await repository.updateService(serviceId, changes); setServices((items) => items.map((item) => item.serviceId === serviceId ? saved : item)); notify('Service availability updated.'); } catch { notify('Service could not be updated.', 'error'); } finally { setUpdating(false); } };
  const deleteProduct = async (productId: string) => { setUpdating(true); try { await repository.deleteProduct(productId); setProducts((items) => items.filter((item) => item.productId !== productId)); notify('Product deleted.'); } catch { notify('Product could not be deleted.', 'error'); } finally { setUpdating(false); } };
  const deleteService = async (serviceId: string) => { setUpdating(true); try { await repository.deleteService(serviceId); setServices((items) => items.filter((item) => item.serviceId !== serviceId)); notify('Service deleted.'); } catch { notify('Service could not be deleted.', 'error'); } finally { setUpdating(false); } };
  const updateOrder = async (orderId: string, status: OrderStatus) => { setUpdating(true); try { await repository.updateOrderStatus(orderId, status); setOrders((items) => items.map((item) => item.orderId === orderId ? { ...item, status } : item)); notify(status === 'COMPLETED' ? 'Order marked completed.' : status === 'CANCELLED' ? 'Order cancelled.' : 'Order started.'); } catch (error) { notify(error instanceof Error ? error.message : 'Order could not be updated.', 'error'); } finally { setUpdating(false); } };

  return { providers, provider, products, services, orders, loading, updating, toast, statistics: useMemo(() => calculateStatistics(orders), [orders]), switchProvider, updateOnline, updateProfile, saveProduct, saveService, patchProduct, patchService, deleteProduct, deleteService, updateOrder, notify, clearToast: () => setToast(null) };
}
