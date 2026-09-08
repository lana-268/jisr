import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/adminService';

interface DashboardStats {
  totalCustomers: number;
  totalProviders: number;
  pendingApprovals: number;
  activeChats: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalProviders: 0,
    pendingApprovals: 0,
    activeChats: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (e) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { stats, loading, error, refetch: fetch };
}
