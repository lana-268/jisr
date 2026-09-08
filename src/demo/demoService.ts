/**
 * Demo Mode — replaces all Firestore operations with in-memory data.
 * Enable by setting VITE_DEMO_MODE=true in .env.local
 * or when no valid Firebase config is provided.
 */
import type { Admin, Provider, Customer, Chat, Message } from '../types';
import {
  DEMO_ADMINS,
  DEMO_PROVIDERS,
  DEMO_CUSTOMERS,
  DEMO_CHATS,
  DEMO_MESSAGES,
  DEMO_STATS,
} from './demoData';

// In-memory mutable state (cloned so mutations don't affect the originals)
let _admins: Admin[] = JSON.parse(JSON.stringify(DEMO_ADMINS));
let _providers: Provider[] = JSON.parse(JSON.stringify(DEMO_PROVIDERS));
let _customers: Customer[] = JSON.parse(JSON.stringify(DEMO_CUSTOMERS));
let _chats: Chat[] = JSON.parse(JSON.stringify(DEMO_CHATS));
let _messages: Record<string, Message[]> = JSON.parse(JSON.stringify(DEMO_MESSAGES));

// Subscribers (mimics onSnapshot callbacks)
type Listener<T> = (data: T) => void;
const providerListeners: Set<Listener<Provider[]>> = new Set();
const customerListeners: Set<Listener<Customer[]>> = new Set();
const chatListeners: Set<Listener<Chat[]>> = new Set();
const messageListeners: Map<string, Set<Listener<Message[]>>> = new Map();
const adminListeners: Set<Listener<Admin[]>> = new Set();

function notifyProviders() { providerListeners.forEach(fn => fn([..._providers])); }
function notifyCustomers() { customerListeners.forEach(fn => fn([..._customers])); }
function notifyChats() { chatListeners.forEach(fn => fn([..._chats])); }
function notifyMessages(chatId: string) {
  messageListeners.get(chatId)?.forEach(fn => fn([...(_messages[chatId] ?? [])]));
}
function notifyAdmins() { adminListeners.forEach(fn => fn([..._admins.filter(a => a.role === 'SUPPORT_ADMIN')])); }

// ── Auth ──────────────────────────────────────────────────────────
export function demoGetAdminByEmail(email: string): Admin | null {
  return _admins.find(a => a.email === email) ?? null;
}

// Accepted demo credentials: super@demo.com / support@demo.com (any password)
export function demoSignIn(email: string, _password: string): Admin {
  const admin = demoGetAdminByEmail(email);
  if (!admin) throw new Error('No admin account found with this email. Try super@demo.com or support@demo.com');
  return admin;
}

// ── Dashboard Stats ───────────────────────────────────────────────
export function demoGetDashboardStats() {
  return {
    totalCustomers: _customers.length,
    totalProviders: _providers.length,
    pendingApprovals: _providers.filter(p => p.status === 'PENDING_APPROVAL').length,
    activeChats: _chats.filter(c => c.status === 'OPEN').length,
  };
}

// ── Providers ─────────────────────────────────────────────────────
export function demoGetPendingProviders() {
  return _providers.filter(p => p.status === 'PENDING_APPROVAL');
}

export function demoGetAllProviders() {
  return [..._providers];
}

export function demoApproveProvider(providerId: string, adminId: string) {
  const p = _providers.find(p => p.providerId === providerId);
  if (p) { p.status = 'APPROVED'; p.approvedByAdminId = adminId; }
  notifyProviders();
}

export function demoRejectProvider(providerId: string) {
  const p = _providers.find(p => p.providerId === providerId);
  if (p) p.status = 'BLOCKED';
  notifyProviders();
}

export function demoBlockProvider(providerId: string) {
  const p = _providers.find(p => p.providerId === providerId);
  if (p) p.status = 'BLOCKED';
  notifyProviders();
}

export function demoUnblockProvider(providerId: string) {
  const p = _providers.find(p => p.providerId === providerId);
  if (p) p.status = 'APPROVED';
  notifyProviders();
}

export function demoSubscribePendingProviders(cb: Listener<Provider[]>) {
  const filtered = () => cb(_providers.filter(p => p.status === 'PENDING_APPROVAL'));
  const wrapper = () => filtered();
  providerListeners.add(wrapper);
  filtered(); // initial call
  return () => { providerListeners.delete(wrapper); };
}

export function demoSubscribeAllProviders(cb: Listener<Provider[]>) {
  const wrapper = () => cb([..._providers]);
  providerListeners.add(wrapper);
  cb([..._providers]);
  return () => { providerListeners.delete(wrapper); };
}

// ── Customers ─────────────────────────────────────────────────────
export function demoBlockCustomer(customerId: string) {
  const c = _customers.find(c => c.customerId === customerId);
  if (c) c.status = 'BLOCKED';
  notifyCustomers();
}

export function demoUnblockCustomer(customerId: string) {
  const c = _customers.find(c => c.customerId === customerId);
  if (c) c.status = 'ACTIVE';
  notifyCustomers();
}

export function demoSubscribeCustomers(cb: Listener<Customer[]>) {
  const wrapper = () => cb([..._customers]);
  customerListeners.add(wrapper);
  cb([..._customers]);
  return () => { customerListeners.delete(wrapper); };
}

// ── Chats ─────────────────────────────────────────────────────────
export function demoSubscribeChats(cb: Listener<Chat[]>) {
  const wrapper = () => cb([..._chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  chatListeners.add(wrapper);
  cb([..._chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  return () => { chatListeners.delete(wrapper); };
}

export function demoSubscribeMessages(chatId: string, cb: Listener<Message[]>) {
  if (!messageListeners.has(chatId)) messageListeners.set(chatId, new Set());
  const wrapper = () => cb([...(_messages[chatId] ?? [])]);
  messageListeners.get(chatId)!.add(wrapper);
  cb([...(_messages[chatId] ?? [])]);
  return () => { messageListeners.get(chatId)?.delete(wrapper); };
}

export function demoSendMessage(chatId: string, senderId: string, senderRole: Message['senderRole'], senderName: string, text: string) {
  const now = new Date().toISOString();
  const msg: Message = {
    messageId: `m-${Date.now()}`,
    chatId,
    senderId,
    senderRole,
    senderName,
    text,
    createdAt: now,
  };
  if (!_messages[chatId]) _messages[chatId] = [];
  _messages[chatId].push(msg);
  const chat = _chats.find(c => c.chatId === chatId);
  if (chat) { chat.lastMessage = text; chat.updatedAt = now; }
  notifyMessages(chatId);
  notifyChats();
}

export function demoAssignChat(chatId: string, adminId: string, adminName: string) {
  const chat = _chats.find(c => c.chatId === chatId);
  if (chat) { chat.assignedAdminId = adminId; chat.assignedAdminName = adminName; }
  notifyChats();
}

export function demoCloseChat(chatId: string) {
  const chat = _chats.find(c => c.chatId === chatId);
  if (chat) chat.status = 'CLOSED';
  notifyChats();
}

// ── Support Admins ────────────────────────────────────────────────
export function demoSubscribeSupportAdmins(cb: Listener<Admin[]>) {
  const wrapper = () => notifyAdmins();
  adminListeners.add(() => cb(_admins.filter(a => a.role === 'SUPPORT_ADMIN')));
  cb(_admins.filter(a => a.role === 'SUPPORT_ADMIN'));
  return () => { adminListeners.delete(wrapper); };
}

export function demoCreateSupportAdmin(data: { fullName: string; email: string }, createdByAdminId: string): Admin {
  if (_admins.find(a => a.email === data.email)) throw new Error('An admin with this email already exists.');
  const newAdmin: Admin = {
    adminId: `support-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    role: 'SUPPORT_ADMIN',
    createdAt: new Date().toISOString(),
    createdByAdminId,
  };
  _admins.push(newAdmin);
  notifyAdmins();
  return newAdmin;
}
