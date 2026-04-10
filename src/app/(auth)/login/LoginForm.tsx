'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { validateAdminCredentials } from '@/lib/admin-auth';

const ADMIN_EMAILS = ['admin@milehigh5280.com', 'manager@milehigh5280.com'];

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate against hardcoded admin credentials
      const result = validateAdminCredentials(formData.email, formData.password);
      
      if (!result.valid) {
        throw new Error('Invalid admin credentials');
      }

      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({
        email: result.admin?.email,
        firstName: result.admin?.firstName,
        lastName: result.admin?.lastName,
        role: result.admin?.role,
        loginTime: new Date().toISOString(),
      }));

      toast.success('Welcome back, ' + result.admin?.firstName + '!');
      router.push('/admin');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-[var(--gold)] shadow-lg shadow-[var(--gold)]/20">
          <Image
            src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
            alt="The Palm Logo"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/60 hover:text-[var(--gold)] transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} />
        <span>Back to home</span>
      </Link>

      <h1 className="text-2xl font-serif text-white mb-1">Admin Login</h1>
      <p className="text-white/50 mb-6 text-sm">Sign in to access the dashboard</p>

      {/* Admin credentials notice */}
      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-3 mb-6 rounded-lg">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--gold)]" />
          <p className="text-[var(--gold)] text-xs">Admin access only</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-white/60 text-sm mb-2">Admin Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@milehigh5280.com"
              required
              className="w-full bg-white/5 border border-white/10 text-white text-base pl-10 pr-4 py-3 rounded-lg outline-none focus:border-[var(--gold)] transition-colors placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="text-white/60 text-sm">Password</label>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter admin password"
              required
              className="w-full bg-white/5 border border-white/10 text-white text-base pl-10 pr-10 py-3 rounded-lg outline-none focus:border-[var(--gold)] transition-colors placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'w-full py-3 bg-[var(--gold)] text-[#080808] text-sm font-bold rounded-lg hover:bg-[#E4B429] transition-colors flex items-center justify-center gap-2',
            loading && 'opacity-70 cursor-not-allowed'
          )}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Signing in...' : 'Access Dashboard'}
        </button>
      </form>

      {/* Back to home */}
      <p className="text-center text-white/40 text-sm mt-6">
        <Link href="/" className="hover:text-white/60 transition-colors">
          ← Back to home
        </Link>
      </p>

      {/* Security */}
      <div className="flex items-center justify-center gap-2 mt-4 text-white/30">
        <Shield size={12} />
        <span className="text-xs">Secure admin access</span>
      </div>
    </div>
  );
}