import { X } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ModalProps { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; size?: 'md' | 'lg' }
export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-heading/35 p-0 sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface shadow-xl sm:rounded-2xl ${size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}>
      <header className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-surface px-5 py-5 sm:px-6"><div><h2 id="modal-title" className="text-xl font-bold text-heading">{title}</h2>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div><button type="button" aria-label="Close dialog" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X className="h-5 w-5" /></button></header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  </div>;
}
