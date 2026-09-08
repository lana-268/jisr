
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import type { ToastMessage } from '../../types';

const icons = {
  success: <CheckCircle size={18} className="text-emerald-500" />,
  error: <AlertCircle size={18} className="text-red-500" />,
  warning: <AlertTriangle size={18} className="text-amber-500" />,
  info: <Info size={18} className="text-blue-500" />,
};

const bars: Record<ToastMessage['type'], string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useToast();
  return (
    <div
      className="relative flex items-start gap-3 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 min-w-[300px] max-w-sm overflow-hidden animate-in slide-in-from-right-5"
      role="alert"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${bars[toast.type]} rounded-l-xl`} />
      <div className="mt-0.5 shrink-0">{icons[toast.type]}</div>
      <p className="text-sm text-slate-700 flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function Toast() {
  const { toasts } = useToast();
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
    >
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
