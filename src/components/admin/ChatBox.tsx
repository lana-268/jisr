import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import type { SenderRole } from '../../types';
import { useChatMessages } from '../../hooks/useChatMessages';
import { sendMessage } from '../../services/chatService';
import { useToast } from '../../contexts/ToastContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';

interface ChatBoxProps {
  chatId: string;
  currentUserId: string;
  currentUserRole: SenderRole;
  currentUserName: string;
  disabled?: boolean;
}

export function ChatBox({ chatId, currentUserId, currentUserRole, currentUserName, disabled }: ChatBoxProps) {
  const { messages, loading } = useChatMessages(chatId);
  const { addToast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text: string) {
    try {
      await sendMessage(chatId, currentUserId, currentUserRole, currentUserName, text);
    } catch {
      addToast('error', 'Failed to send message. Please try again.');
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={28} />}
            title="No messages yet"
            description="Start the conversation by sending the first message below."
          />
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.messageId} message={msg} currentUserId={currentUserId} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={disabled} />
    </div>
  );
}
