import { useEffect, useState } from 'react';
import { subscribeAllProviders } from '../services/providerService';
import type { Provider } from '../types';

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeAllProviders((data) => {
      setProviders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { providers, loading };
}
