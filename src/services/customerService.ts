import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isDemoMode } from '../firebase';
import type { Customer } from '../types';
import * as demo from '../demo/demoService';

const COL = 'customers';

export async function getCustomers(): Promise<Customer[]> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ customerId: d.id, ...d.data() } as Customer));
}

export async function blockCustomer(customerId: string): Promise<void> {
  if (isDemoMode) return demo.demoBlockCustomer(customerId);
  await updateDoc(doc(db, COL, customerId), { status: 'BLOCKED' });
}

export async function unblockCustomer(customerId: string): Promise<void> {
  if (isDemoMode) return demo.demoUnblockCustomer(customerId);
  await updateDoc(doc(db, COL, customerId), { status: 'ACTIVE' });
}

export function subscribeCustomers(cb: (customers: Customer[]) => void): Unsubscribe {
  if (isDemoMode) return demo.demoSubscribeCustomers(cb) as any;
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ customerId: d.id, ...d.data() } as Customer)));
  });
}
