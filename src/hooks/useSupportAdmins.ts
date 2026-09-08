import { useEffect, useState } from 'react';
import { subscribeSupportAdmins } from '../services/adminService';
import type { Admin } from '../types';

export function useSupportAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeSupportAdmins((data) => {
      setAdmins(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { admins, loading };
}
