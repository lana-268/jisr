import { useCallback, useEffect, useState } from 'react';
import type { ProductCategory, ProductItem, Provider, ServiceCategory, ServiceItem } from '../../../types';
import { catalogRepository, type CatalogRepository } from '../data/catalogRepository';

export interface UseCatalogResult { providers: Provider[]; productCategories: ProductCategory[]; serviceCategories: ServiceCategory[]; products: ProductItem[]; services: ServiceItem[]; loading: boolean; error: string | null; retry: () => void }
export function useCatalog(repository: CatalogRepository = catalogRepository): UseCatalogResult {
  const [data, setData] = useState<Omit<UseCatalogResult, 'loading' | 'error' | 'retry'>>({ providers: [], productCategories: [], serviceCategories: [], products: [], services: [] });
  const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => { let active = true; setLoading(true); setError(null); Promise.all([repository.getProviders(), repository.getProductCategories(), repository.getServiceCategories(), repository.getProducts(), repository.getServices()]).then(([providers, productCategories, serviceCategories, products, services]) => { if (active) setData({ providers, productCategories, serviceCategories, products, services }); }).catch(() => { if (active) setError('We couldn’t load the marketplace'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [attempt, repository]);
  return { ...data, loading, error, retry };
}
