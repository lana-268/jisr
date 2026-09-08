import { useEffect, useState } from 'react';
import { subscribePendingProviders } from '../services/providerService';
import type { Provider } from '../types';

export function usePendingProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribePendingProviders((data) => {
      setProviders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { providers, loading, error };
}
