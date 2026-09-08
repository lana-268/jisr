import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, Eye, EyeOff, Loader2, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isDemoMode } from '../firebase';

export function LoginPage() {
  const { signIn, admin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      // Auth context will resolve the admin doc; redirect based on role
    } catch (err: any) {
      setError(err?.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Redirect after sign-in (admin state will be updated by AuthContext)
  if (admin) {
    const path = admin.role === 'SUPER_ADMIN' ? '/admin/super' : '/admin/support';
    navigate(path, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-4">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">MahalleHub</h1>
          <p className="text-sm text-slate-400 mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
          <p className="text-sm text-slate-400 mb-6">Enter your admin credentials to continue</p>

          {isDemoMode && (
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Demo Mode Active</p>
                <p className="text-xs">Use <strong className="text-white">super@demo.com</strong> or <strong className="text-white">support@demo.com</strong> (any password works).</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isDemoMode ? "super@demo.com" : "admin@mahallehub.com"}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-transparent mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          MahalleHub Admin Panel · Authorized access only
        </p>
      </div>
    </div>
  );
}
