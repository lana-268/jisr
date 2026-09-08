import { useState } from 'react';
import { CustomerMessages } from '../../features/provider/components/CustomerMessages';
import { Toast } from '../../shared/components/Feedback';
import { PublicHeader, SiteFooter } from '../../shared/layout/PublicLayout';

export function CustomerMessagesPage() {
  const [toast, setToast] = useState<string | null>(null);
  return <div className="min-h-screen bg-page"><PublicHeader mode="catalog" onHelp={() => setToast('Our demo support team is here to help.')} onFavorites={() => setToast('Open Explore to view your saved favorites.')}/><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Customer account</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-heading">Messages</h1><p className="mt-2 text-muted">Chat with providers about your requests and active orders.</p></div><div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card"><CustomerMessages onMessageSent={setToast}/></div></main><SiteFooter/><Toast message={toast} onClose={() => setToast(null)}/></div>;
}