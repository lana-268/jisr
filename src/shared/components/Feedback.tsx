import { AlertTriangle, Inbox, X } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps { open: boolean; title: string; message: string; confirmLabel?: string; danger?: boolean; loading?: boolean; onConfirm: () => void; onClose: () => void }
export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, loading, onConfirm, onClose }: ConfirmDialogProps) {
  return <Modal open={open} onClose={onClose} title={title}><div className="flex gap-3 rounded-xl bg-page p-4"><AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${danger ? 'text-danger' : 'text-warning'}`} /><p className="text-sm leading-6 text-body">{message}</p></div><div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onClose}>Keep it</Button><Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button></div></Modal>;
}

export interface ToastProps { message: string | null; tone?: 'success' | 'error'; onClose: () => void }
export function Toast({ message, tone = 'success', onClose }: ToastProps) { if (!message) return null; return <div aria-live="polite" className={`fixed bottom-5 right-4 z-[60] flex max-w-sm items-center gap-3 rounded-xl border bg-surface px-4 py-3 text-sm font-medium shadow-lg ${tone === 'error' ? 'border-red-200 text-danger' : 'border-border text-heading'}`}><span className={`h-2 w-2 rounded-full ${tone === 'error' ? 'bg-danger' : 'bg-success'}`} />{message}<button type="button" aria-label="Dismiss notification" onClick={onClose} className="ml-2 rounded p-1 hover:bg-page"><X className="h-4 w-4" /></button></div>; }

export interface EmptyStateProps { title: string; description: string; action?: React.ReactNode }
export function EmptyState({ title, description, action }: EmptyStateProps) { return <div className="flex flex-col items-center justify-center px-6 py-12 text-center"><span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary"><Inbox className="h-6 w-6" /></span><h3 className="font-semibold text-heading">{title}</h3><p className="mt-1 max-w-sm text-sm text-muted">{description}</p>{action && <div className="mt-5">{action}</div>}</div>; }

export function LoadingSkeleton() { return <div className="min-h-screen bg-page p-4 lg:pl-[272px] lg:pt-28"><div className="mx-auto max-w-7xl animate-pulse space-y-8"><div className="h-16 rounded-xl bg-border"/><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-28 rounded-xl bg-border" />)}</div><div className="h-80 rounded-xl bg-border" /></div></div>; }
