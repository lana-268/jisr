import { useState, useEffect } from 'react';
import { X, UserPlus, Mail, User } from 'lucide-react';
import { createSupportAdmin } from '../../services/adminService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function AddSupportAdminModal({ isOpen, onClose, onCreated }: Props) {
  const { admin } = useAuth();
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setFullName(''); setEmail(''); setErrors({}); }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, loading, onClose]);

  function validate() {
    const errs: typeof errors = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !admin) return;
    setLoading(true);
    try {
      await createSupportAdmin({ fullName: fullName.trim(), email: email.trim() }, admin.adminId);
      addToast('success', 'Support admin created successfully');
      onCreated();
      onClose();
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to create support admin');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-admin-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <UserPlus size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 id="add-admin-title" className="text-base font-semibold text-slate-900">Add Support Admin</h2>
              <p className="text-xs text-slate-500 mt-0.5">Role will be set to Support Admin</p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading} className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>
          <div>
            <label htmlFor="admin-fullname" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-fullname"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Sarah Al-Rashid"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                disabled={loading}
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. sarah@mahallehub.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-xs text-slate-500">Role will be automatically set to <span className="font-semibold text-slate-700">Support Admin</span></span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Support Admin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
