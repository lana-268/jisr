import { useState } from 'react';
import { ArrowLeft, UserCheck, Users, X, MessageSquare } from 'lucide-react';
import { useChats } from '../../hooks/useChats';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { assignChat, closeChat } from '../../services/chatService';
import { SupportChatList } from '../../components/admin/SupportChatList';
import { ChatBox } from '../../components/admin/ChatBox';
import { EmptyState } from '../../components/admin/EmptyState';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import type { Chat } from '../../types';

export function SupportChats() {
  const { chats, loading } = useChats();
  const { admin } = useAuth();
  const { addToast } = useToast();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [closeConfirm, setCloseConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  function handleSelectChat(chat: Chat) {
    setSelectedChat(chat);
    setMobileView('chat');
  }

  async function handleAssign() {
    if (!selectedChat || !admin) return;
    setActionLoading(true);
    try {
      await assignChat(selectedChat.chatId, admin.adminId, admin.fullName);
      addToast('success', 'Chat assigned to you');
      setSelectedChat(prev => prev ? { ...prev, assignedAdminId: admin.adminId, assignedAdminName: admin.fullName } : prev);
    } catch {
      addToast('error', 'Failed to assign chat');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClose() {
    if (!selectedChat) return;
    setActionLoading(true);
    try {
      await closeChat(selectedChat.chatId);
      addToast('success', 'Chat closed successfully');
      setCloseConfirm(false);
      setSelectedChat(null);
      setMobileView('list');
    } catch {
      addToast('error', 'Failed to close chat');
    } finally {
      setActionLoading(false);
    }
  }

  const isMyChat = selectedChat?.assignedAdminId === admin?.adminId;
  const isAssigned = !!selectedChat?.assignedAdminId;
  const isSuperAdmin = admin?.role === 'SUPER_ADMIN';

  return (
    <div className="h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 flex">
      {/* Chat List Panel */}
      <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-80 lg:w-88 xl:w-96 bg-white border-r border-slate-200 shrink-0`}>
        {/* List Header */}
        <div className="px-4 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Support Inbox</h2>
              <p className="text-xs text-slate-500">{chats.length} conversations</p>
            </div>
          </div>
        </div>
        <SupportChatList
          chats={chats}
          selectedChatId={selectedChat?.chatId ?? null}
          onSelect={handleSelectChat}
          loading={loading}
        />
      </div>

      {/* Conversation Panel */}
      <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-col flex-1 min-w-0 bg-[#F8FAFC]`}>
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={<Users size={28} />}
              title="Select a conversation"
              description="Choose a chat from the inbox to start reviewing the conversation."
            />
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Back button (mobile) */}
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Back to chat list"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {(selectedChat.customerName ?? 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{selectedChat.customerName ?? 'Unknown Customer'}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <span>↔</span>
                      <span>{selectedChat.businessName ?? selectedChat.providerName ?? 'Unknown Provider'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Assignment status */}
                {isAssigned && (
                  <span className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${
                    isMyChat ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    <UserCheck size={13} />
                    {isMyChat ? 'Assigned to you' : `Assigned to ${selectedChat.assignedAdminName ?? 'another admin'}`}
                  </span>
                )}

                {/* Assign to me */}
                {(!isAssigned || (isSuperAdmin && !isMyChat)) && (
                  <button
                    onClick={handleAssign}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-60"
                  >
                    <UserCheck size={13} />
                    {!isAssigned ? 'Assign to me' : 'Take over'}
                  </button>
                )}

                {/* Close chat */}
                {selectedChat.status !== 'CLOSED' && (
                  <button
                    onClick={() => setCloseConfirm(true)}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    aria-label="Close chat"
                  >
                    <X size={13} />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-hidden">
              <ChatBox
                chatId={selectedChat.chatId}
                currentUserId={admin?.adminId ?? ''}
                currentUserRole="ADMIN"
                currentUserName={admin?.fullName ?? 'Admin'}
                disabled={selectedChat.status === 'CLOSED'}
              />
            </div>

            {selectedChat.status === 'CLOSED' && (
              <div className="bg-slate-100 border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500 font-medium">
                This chat has been closed and is read-only.
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={closeConfirm}
        onClose={() => setCloseConfirm(false)}
        onConfirm={handleClose}
        title="Close Conversation"
        message="Are you sure you want to close this conversation? It will become read-only."
        confirmLabel="Close Chat"
        confirmVariant="warning"
        loading={actionLoading}
      />
    </div>
  );
}
