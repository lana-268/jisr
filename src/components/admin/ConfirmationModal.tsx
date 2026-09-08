import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
  icon,
}: ConfirmationModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="shrink-0 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[confirmVariant]}`}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
