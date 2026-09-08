import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isDemoMode } from '../firebase';
import type { Provider, ProviderStatus } from '../types';
import * as demo from '../demo/demoService';

const COL = 'providers';

export async function getPendingProviders(): Promise<Provider[]> {
  if (isDemoMode) return demo.demoGetPendingProviders();
  const q = query(
    collection(db, COL),
    where('status', '==', 'PENDING_APPROVAL'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ providerId: d.id, ...d.data() } as Provider));
}

export async function getAllProviders(): Promise<Provider[]> {
  if (isDemoMode) return demo.demoGetAllProviders();
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ providerId: d.id, ...d.data() } as Provider));
}

export async function approveProvider(providerId: string, adminId: string): Promise<void> {
  if (isDemoMode) return demo.demoApproveProvider(providerId, adminId);
  await updateDoc(doc(db, COL, providerId), {
    status: 'APPROVED' as ProviderStatus,
    approvedByAdminId: adminId,
  });
}

export async function rejectProvider(providerId: string): Promise<void> {
  if (isDemoMode) return demo.demoRejectProvider(providerId);
  await updateDoc(doc(db, COL, providerId), {
    status: 'BLOCKED' as ProviderStatus,
  });
}

export async function blockProvider(providerId: string): Promise<void> {
  if (isDemoMode) return demo.demoBlockProvider(providerId);
  await updateDoc(doc(db, COL, providerId), { status: 'BLOCKED' as ProviderStatus });
}

export async function unblockProvider(providerId: string): Promise<void> {
  if (isDemoMode) return demo.demoUnblockProvider(providerId);
  await updateDoc(doc(db, COL, providerId), { status: 'APPROVED' as ProviderStatus });
}

export function subscribePendingProviders(cb: (providers: Provider[]) => void): Unsubscribe {
  if (isDemoMode) return demo.demoSubscribePendingProviders(cb) as any;
  const q = query(
    collection(db, COL),
    where('status', '==', 'PENDING_APPROVAL'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ providerId: d.id, ...d.data() } as Provider)));
  });
}

export function subscribeAllProviders(cb: (providers: Provider[]) => void): Unsubscribe {
  if (isDemoMode) return demo.demoSubscribeAllProviders(cb) as any;
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ providerId: d.id, ...d.data() } as Provider)));
  });
}
