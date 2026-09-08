import { useEffect, useState } from 'react';
import { subscribeChatMessages } from '../services/chatService';
import type { Message } from '../types';

export function useChatMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    const unsub = subscribeChatMessages(chatId, (data) => {
      setMessages(data);
      setLoading(false);
    });
    return unsub;
  }, [chatId]);

  return { messages, loading };
}
