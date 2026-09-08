import { useEffect, useState } from 'react';
import { subscribeCustomers } from '../services/customerService';
import type { Customer } from '../types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeCustomers((data) => {
      setCustomers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { customers, loading };
}
