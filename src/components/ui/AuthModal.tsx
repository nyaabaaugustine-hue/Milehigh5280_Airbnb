'use client';

import { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all required fields'); return;
    }
    if (mode === 'register' && (!form.firstName || !form.lastName)) {
      toast.error('Please enter your full name'); return;
    }

    setLoading(true);
    try {
      let success: boolean;
      if (mode === 'login') {
        success = await login(form.email, form.password);
      } else {
        success = await register({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
        });
      }
      if (success) {
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
        onClose();
        setForm({ email: '', password: '', firstName: '', lastName: '', phone: '' });
      }
    } catch {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease' }}>
      <div className="absolute inset-0 bg-[#080808]/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] shadow-2xl"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <p className="section-label text-[0.55rem] mb-1">My Account</p>
            <h2 className="font-serif text-xl text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-[var(--border)] hover:border-[var(--gold)] transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex border border-[var(--border)]">
            <button onClick={() => setMode('login')} className={cn(
              'flex-1 py-3 text-xs uppercase tracking-widest font-bold transition-colors',
              mode === 'login' ? 'bg-[var(--gold)] text-[#080808]' : 'text-[var(--text-muted)] hover:text-white'
            )}>Sign In</button>
            <button onClick={() => setMode('register')} className={cn(
              'flex-1 py-3 text-xs uppercase tracking-widest font-bold transition-colors',
              mode === 'register' ? 'bg-[var(--gold)] text-[#080808]' : 'text-[var(--text-muted)] hover:text-white'
            )}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-label text-[0.55rem] block mb-1.5">First Name *</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="text" className="input-luxury pl-9" placeholder="John"
                      value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label className="section-label text-[0.55rem] block mb-1.5">Last Name *</label>
                  <input type="text" className="input-luxury" placeholder="Mensah"
                    value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required />
                </div>
              </div>
            )}

            <div>
              <label className="section-label text-[0.55rem] block mb-1.5">Email *</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input type="email" className="input-luxury pl-9" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>

            <div>
              <label className="section-label text-[0.55rem] block mb-1.5">Password *</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input type={showPassword ? 'text' : 'password'} className="input-luxury pl-9 pr-10"
                  placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-white">
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="section-label text-[0.55rem] block mb-1.5">Phone (Optional)</label>
                <input type="tel" className="input-luxury" placeholder="+233 XX XXX XXXX"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-[var(--gold)] text-xs hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className={cn('btn-gold w-full', loading && 'opacity-70')}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'register' && (
            <p className="text-[var(--text-subtle)] text-xs text-center">
              By registering, you agree to our{' '}
              <a href="/terms" className="text-[var(--gold)] hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-[var(--gold)] hover:underline">Privacy Policy</a>.
            </p>
          )}

          <div className="border-t border-[var(--border)] pt-4">
            <p className="text-[var(--text-subtle)] text-xs text-center mb-3">Benefits of having an account:</p>
            <div className="space-y-2">
              {['Save your favourite properties', 'View booking history', 'Faster checkout'].map(b => (
                <div key={b} className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
                  <CheckCircle size={12} className="text-[var(--gold)]" /> {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
