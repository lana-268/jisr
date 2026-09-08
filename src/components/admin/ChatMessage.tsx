import type { Message } from '../../types';
import { formatDistanceToNow } from '../../utils/date';
import { Shield } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
}

const roleBubble: Record<string, string> = {
  CUSTOMER: 'bg-white border border-slate-200 text-slate-900',
  PROVIDER: 'bg-blue-600 text-white',
  ADMIN: 'bg-amber-50 border border-amber-200 text-amber-900',
};

const roleAlign: Record<string, 'left' | 'right'> = {
  CUSTOMER: 'right',
  PROVIDER: 'left',
  ADMIN: 'left',
};

export function ChatMessage({ message, currentUserId }: ChatMessageProps) {
  const isMine = message.senderId === currentUserId;
  const align = isMine ? 'right' : roleAlign[message.senderRole] ?? 'left';
  const isRight = align === 'right';
  const isAdmin = message.senderRole === 'ADMIN';
  const bubbleCls = roleBubble[message.senderRole] ?? 'bg-white border border-slate-200 text-slate-900';

  return (
    <div className={`flex gap-2 ${isRight ? 'flex-row-reverse' : 'flex-row'} mb-3`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
        isAdmin ? 'bg-amber-400 text-amber-900' :
        message.senderRole === 'PROVIDER' ? 'bg-blue-600 text-white' :
        'bg-slate-200 text-slate-700'
      }`}>
        {isAdmin ? <Shield size={14} /> : (message.senderName?.charAt(0) ?? '?').toUpperCase()}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] flex flex-col ${isRight ? 'items-end' : 'items-start'}`}>
        {/* Sender name */}
        <div className={`flex items-center gap-1.5 mb-1 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs font-medium text-slate-600">{message.senderName ?? message.senderRole}</span>
          {isAdmin && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
              <Shield size={10} /> Official Support
            </span>
          )}
        </div>
        <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${bubbleCls} ${isRight ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 px-1">{formatDistanceToNow(message.createdAt)}</span>
      </div>
    </div>
  );
}
