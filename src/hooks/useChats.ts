import { useEffect, useState } from 'react';
import { subscribeChats } from '../services/chatService';
import type { Chat } from '../types';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeChats((data) => {
      setChats(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { chats, loading };
}
