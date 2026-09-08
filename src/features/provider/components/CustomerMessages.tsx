import { ArrowLeft, CheckCheck, MessageCircle, Search, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { mockConversations, type Conversation } from '../data/mockMessages';

export interface CustomerMessagesProps { onMessageSent: (message: string) => void }

const timeLabel = (value: string) => new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

export function CustomerMessages({ onMessageSent }: CustomerMessagesProps) {
  const [conversations, setConversations] = useState<Conversation[]>(() => structuredClone(mockConversations));
  const [selectedId, setSelectedId] = useState(conversations[0]?.conversationId ?? '');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [showThread, setShowThread] = useState(false);
  const selected = conversations.find((conversation) => conversation.conversationId === selectedId) ?? conversations[0];
  const filtered = useMemo(() => conversations.filter((conversation) => `${conversation.itemTitle} ${conversation.orderId}`.toLowerCase().includes(search.toLowerCase())), [conversations, search]);
  const chooseConversation = (id: string) => {
    setSelectedId(id); setShowThread(true);
    setConversations((items) => items.map((conversation) => conversation.conversationId === id ? { ...conversation, messages: conversation.messages.map((message) => ({ ...message, read: true })) } : conversation));
  };
  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault(); const body = draft.trim(); if (!body || !selected) return;
    setConversations((items) => items.map((conversation) => conversation.conversationId === selected.conversationId ? { ...conversation, messages: [...conversation.messages, { messageId: `message-${crypto.randomUUID()}`, sender: 'CUSTOMER', body, sentAt: new Date().toISOString(), read: true }] } : conversation));
    setDraft(''); onMessageSent(`Message sent to your provider.`);
  };
  return <div className="flex h-[min(680px,78vh)] w-full min-w-0 max-w-full overflow-hidden" aria-label="Customer messages">
    <aside className={`${showThread ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-border bg-page/50 md:w-72 lg:w-80`}>
      <div className="border-b border-border p-4"><label htmlFor="customer-conversation-search" className="sr-only">Search conversations</label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/><input id="customer-conversation-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" className="h-11 w-full rounded-lg border border-border-strong bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"/></div></div>
      <div className="flex-1 overflow-y-auto">{filtered.length ? filtered.map((conversation) => { const last = conversation.messages.at(-1); const unread = conversation.messages.filter((message) => !message.read && message.sender === 'PROVIDER').length; return <button type="button" key={conversation.conversationId} onClick={() => chooseConversation(conversation.conversationId)} className={`flex w-full gap-3 border-b border-border p-4 text-left transition-colors hover:bg-surface ${selectedId === conversation.conversationId ? 'bg-primary-soft/70' : ''}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-xs font-bold text-success">{conversation.customerInitials}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><strong className="truncate text-sm text-heading">{conversation.itemTitle}</strong>{last && <span className="text-[11px] text-muted">{timeLabel(last.sentAt)}</span>}</span><span className="mt-0.5 block truncate text-xs text-muted">{conversation.orderId} · Provider chat</span><span className={`mt-1 block truncate text-sm ${unread ? 'font-semibold text-heading' : 'text-muted'}`}>{last?.body}</span></span>{unread > 0 && <span className="mt-7 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{unread}</span>}</button>; }) : <div className="px-5 py-12 text-center"><MessageCircle className="mx-auto h-7 w-7 text-muted"/><p className="mt-3 text-sm font-semibold text-heading">No conversations found</p><p className="mt-1 text-xs text-muted">Try a different order or listing.</p></div>}</div>
    </aside>
    {selected ? <section className={`${showThread ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col bg-surface`} aria-label={`Conversation about ${selected.itemTitle}`}>
      <header className="flex min-h-16 items-center gap-3 border-b border-border px-4"><button type="button" aria-label="Back to conversations" onClick={() => setShowThread(false)} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-page md:hidden"><ArrowLeft className="h-5 w-5"/></button><span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-xs font-bold text-success">J</span><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-heading">{selected.itemTitle}</h3><p className="truncate text-xs text-muted">{selected.orderId} · Your provider</p></div><span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-success"><span className="h-2 w-2 rounded-full bg-success"/>Active chat</span></header>
      <div className="flex-1 space-y-4 overflow-y-auto bg-page/40 p-4 sm:p-6">{selected.messages.map((message) => <div key={message.messageId} className={`flex ${message.sender === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${message.sender === 'CUSTOMER' ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md border border-border bg-surface text-body'}`}><p>{message.body}</p><p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${message.sender === 'CUSTOMER' ? 'text-white/75' : 'text-muted'}`}>{timeLabel(message.sentAt)}{message.sender === 'CUSTOMER' && <CheckCheck className="h-3 w-3"/>}</p></div></div>)}</div>
      <form onSubmit={sendMessage} className="flex min-w-0 items-end gap-2 border-t border-border p-3 sm:p-4"><label htmlFor="customer-message-draft" className="sr-only">Message your provider</label><textarea id="customer-message-draft" rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" className="min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-border-strong px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"/><Button type="submit" disabled={!draft.trim()} className="!h-11 !w-11 !min-h-11 !shrink-0 !px-0" aria-label="Send message" icon={<Send className="h-4 w-4"/>}/></form>
    </section> : null}
  </div>;
}