import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isDemoMode } from '../firebase';
import type { Admin, AdminType } from '../types';
import * as demo from '../demo/demoService';

const ADMINS_COLLECTION = 'admins';

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  if (isDemoMode) return demo.demoGetAdminByEmail(email);
  const q = query(collection(db, ADMINS_COLLECTION), where('email', '==', email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { adminId: d.id, ...d.data() } as Admin;
}

export async function getAdminById(adminId: string): Promise<Admin | null> {
  const ref = doc(db, ADMINS_COLLECTION, adminId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { adminId: snap.id, ...snap.data() } as Admin;
}

export async function getSupportAdmins(): Promise<Admin[]> {
  const q = query(
    collection(db, ADMINS_COLLECTION),
    where('role', '==', 'SUPPORT_ADMIN'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ adminId: d.id, ...d.data() } as Admin));
}

export async function createSupportAdmin(
  data: { fullName: string; email: string },
  createdByAdminId: string
): Promise<Admin> {
  if (isDemoMode) return demo.demoCreateSupportAdmin(data, createdByAdminId);
  const existing = await getAdminByEmail(data.email);
  if (existing) throw new Error('An admin with this email already exists.');

  const newAdmin = {
    fullName: data.fullName,
    email: data.email,
    role: 'SUPPORT_ADMIN' as AdminType,
    createdAt: new Date().toISOString(),
    createdByAdminId,
  };
  const ref = await addDoc(collection(db, ADMINS_COLLECTION), newAdmin);
  return { adminId: ref.id, ...newAdmin };
}

export function subscribeSupportAdmins(cb: (admins: Admin[]) => void): Unsubscribe {
  if (isDemoMode) return demo.demoSubscribeSupportAdmins(cb) as any;
  const q = query(
    collection(db, ADMINS_COLLECTION),
    where('role', '==', 'SUPPORT_ADMIN'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ adminId: d.id, ...d.data() } as Admin)));
  });
}

export async function getDashboardStats() {
  if (isDemoMode) return demo.demoGetDashboardStats();
  const [customersSnap, providersSnap, pendingSnap, chatsSnap] = await Promise.all([
    getDocs(collection(db, 'customers')),
    getDocs(collection(db, 'providers')),
    getDocs(query(collection(db, 'providers'), where('status', '==', 'PENDING_APPROVAL'))),
    getDocs(query(collection(db, 'chats'), where('status', '==', 'OPEN'))),
  ]);
  return {
    totalCustomers: customersSnap.size,
    totalProviders: providersSnap.size,
    pendingApprovals: pendingSnap.size,
    activeChats: chatsSnap.size,
  };
}
