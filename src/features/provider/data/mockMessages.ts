export interface ChatMessage {
  messageId: string;
  sender: 'CUSTOMER' | 'PROVIDER';
  body: string;
  sentAt: string;
  read: boolean;
}

export interface Conversation {
  conversationId: string;
  customerName: string;
  customerInitials: string;
  orderId: string;
  itemTitle: string;
  messages: ChatMessage[];
}

export const mockConversations: Conversation[] = [
  {
    conversationId: 'conversation-1', customerName: 'Elif Yılmaz', customerInitials: 'EY', orderId: 'JSR-1048', itemTitle: 'Chicken Kabsa',
    messages: [
      { messageId: 'm-1', sender: 'CUSTOMER', body: 'Merhaba! Could I have the kabsa with less spice, please?', sentAt: '2026-09-08T08:34:00Z', read: true },
      { messageId: 'm-2', sender: 'PROVIDER', body: 'Of course, Elif. I’ll prepare it mild for you.', sentAt: '2026-09-08T08:39:00Z', read: true },
      { messageId: 'm-3', sender: 'CUSTOMER', body: 'Perfect, thank you! What time should I expect it?', sentAt: '2026-09-08T08:42:00Z', read: false },
    ],
  },
  {
    conversationId: 'conversation-2', customerName: 'Ayşe Demir', customerInitials: 'AD', orderId: 'JSR-1045', itemTitle: 'Stuffed Grape Leaves',
    messages: [
      { messageId: 'm-4', sender: 'CUSTOMER', body: 'Are the grape leaves ready for pickup?', sentAt: '2026-09-07T13:10:00Z', read: true },
      { messageId: 'm-5', sender: 'PROVIDER', body: 'They’ll be ready at 16:30. I’ll message you as soon as they are packed.', sentAt: '2026-09-07T13:14:00Z', read: true },
    ],
  },
  {
    conversationId: 'conversation-3', customerName: 'Can Kaya', customerInitials: 'CK', orderId: 'JSR-1039', itemTitle: 'Maqluba Family Tray',
    messages: [
      { messageId: 'm-6', sender: 'CUSTOMER', body: 'Everything was delicious. My family loved it!', sentAt: '2026-09-05T19:24:00Z', read: false },
    ],
  },
];
