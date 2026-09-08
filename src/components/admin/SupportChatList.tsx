import type { Chat } from '../../types';
import { formatDistanceToNow } from '../../utils/date';
import { MessageCircle } from 'lucide-react';
import { cn } from '../../utils/format';

interface SupportChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelect: (chat: Chat) => void;
  loading?: boolean;
}

function ChatListItem({ chat, isSelected, onClick }: { chat: Chat; isSelected: boolean; onClick: () => void }) {
  const hasUnread = (chat.unreadCount ?? 0) > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
        isSelected && 'bg-blue-50 border-l-2 border-l-blue-600 hover:bg-blue-50'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
          )}>
            {(chat.customerName ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className={cn('text-sm truncate', hasUnread || isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-800')}>
              {chat.customerName ?? 'Unknown Customer'}
            </p>
            <p className="text-xs text-slate-500 truncate">{chat.businessName ?? chat.providerName ?? 'Unknown Provider'}</p>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-[10px] text-slate-400">{formatDistanceToNow(chat.updatedAt)}</span>
          {hasUnread && (
            <span className="min-w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
      {chat.lastMessage && (
        <p className={cn('text-xs mt-2 truncate pl-12', hasUnread ? 'text-slate-700 font-medium' : 'text-slate-500')}>
          {chat.lastMessage}
        </p>
      )}
    </button>
  );
}

export function SupportChatList({ chats, selectedChatId, onSelect, loading }: SupportChatListProps) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <MessageCircle size={22} />
        </div>
        <p className="text-sm font-medium text-slate-600">No conversations</p>
        <p className="text-xs text-slate-400 mt-1">Support chats will appear here</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 scrollbar-thin">
      {chats.map(chat => (
        <ChatListItem
          key={chat.chatId}
          chat={chat}
          isSelected={chat.chatId === selectedChatId}
          onClick={() => onSelect(chat)}
        />
      ))}
    </div>
  );
}
