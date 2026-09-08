import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isDemoMode } from '../firebase';
import type { Chat, Message, SenderRole } from '../types';
import * as demo from '../demo/demoService';

const CHATS_COL = 'chats';

export async function getChats(): Promise<Chat[]> {
  const q = query(collection(db, CHATS_COL), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ chatId: d.id, ...d.data() } as Chat));
}

export function subscribeChats(cb: (chats: Chat[]) => void): Unsubscribe {
  if (isDemoMode) return demo.demoSubscribeChats(cb) as any;
  const q = query(collection(db, CHATS_COL), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ chatId: d.id, ...d.data() } as Chat)));
  });
}

export function subscribeChatMessages(chatId: string, cb: (messages: Message[]) => void): Unsubscribe {
  if (isDemoMode) return demo.demoSubscribeMessages(chatId, cb) as any;
  const q = query(
    collection(db, CHATS_COL, chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ messageId: d.id, ...d.data() } as Message)));
  });
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  senderRole: SenderRole,
  senderName: string,
  text: string
): Promise<void> {
  if (isDemoMode) return demo.demoSendMessage(chatId, senderId, senderRole, senderName, text);
  const now = new Date().toISOString();
  const msgRef = collection(db, CHATS_COL, chatId, 'messages');
  await addDoc(msgRef, {
    chatId,
    senderId,
    senderRole,
    senderName,
    text: text.trim(),
    createdAt: now,
  });
  await updateDoc(doc(db, CHATS_COL, chatId), {
    lastMessage: text.trim(),
    updatedAt: now,
  });
}

export async function assignChat(chatId: string, adminId: string, adminName: string): Promise<void> {
  if (isDemoMode) return demo.demoAssignChat(chatId, adminId, adminName);
  await updateDoc(doc(db, CHATS_COL, chatId), {
    assignedAdminId: adminId,
    assignedAdminName: adminName,
  });
}

export async function closeChat(chatId: string): Promise<void> {
  if (isDemoMode) return demo.demoCloseChat(chatId);
  await updateDoc(doc(db, CHATS_COL, chatId), { status: 'CLOSED' });
}
