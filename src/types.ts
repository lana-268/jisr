// ── Admin ─────────────────────────────────────────────────────
export type AdminType = 'SUPER_ADMIN' | 'SUPPORT_ADMIN';

export interface Admin {
  adminId: string;
  fullName: string;
  email: string;
  role: AdminType;
  createdAt: string;
  createdByAdminId?: string;
}

// ── Provider ──────────────────────────────────────────────────
export type ProviderType = 'HOME_PRODUCT' | 'GENERAL_SERVICE';
export type ProviderStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED';

export interface Provider {
  providerId: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  district: string;
  providerType: ProviderType;
  status: ProviderStatus;
  isOnline: boolean;
  createdAt: string;
  approvedByAdminId?: string | null;
  imageUrl?: string | null;
  description?: string | null;
}

// ── Customer ──────────────────────────────────────────────────
export type CustomerStatus = 'ACTIVE' | 'BLOCKED';

export interface Customer {
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  district: string;
  status: CustomerStatus;
  createdAt: string;
  avatarUrl?: string | null;
}

// ── Chat ──────────────────────────────────────────────────────
export type SenderRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type ChatStatus = 'OPEN' | 'CLOSED';

export interface Chat {
  chatId: string;
  customerId: string;
  providerId: string;
  customerName?: string;
  providerName?: string;
  businessName?: string;
  assignedAdminId?: string | null;
  assignedAdminName?: string | null;
  lastMessage?: string | null;
  updatedAt: string;
  status?: ChatStatus;
  unreadCount?: number;
}

export interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  senderRole: SenderRole;
  senderName?: string;
  text: string;
  createdAt: string;
}

// ── UI Helpers ────────────────────────────────────────────────
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: AdminType[];
}
