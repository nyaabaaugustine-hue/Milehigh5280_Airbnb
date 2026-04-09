'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      toast.success('Welcome back!');
      router.push('/');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <div className="bg-[var(--surface)] border border-[var(--border)] p-8 md:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--gold)]">
            <Image
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
              alt="The Palm Logo"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-center text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-[var(--text-muted)] text-center mb-8 text-base">
          Sign in to your account
        </p>

        {/* Demo notice */}
        <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-4 mb-6">
          <p className="text-[var(--gold)] text-sm text-center">
            Demo Mode — Use any email & password to explore
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[var(--text-muted)] text-sm mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] pl-12 pr-4 py-3.5 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-[var(--text-muted)] text-sm">
                Password
              </label>
              <Link href="/forgot-password" className="text-[var(--gold)] hover:text-[#E4B429] text-sm transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] pl-12 pr-12 py-3.5 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-3">
            <input
              id="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
              className="w-5 h-5 rounded border-[var(--border)] bg-[var(--surface-2)] text-[var(--gold)] focus:ring-[var(--gold)] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="remember" className="text-[var(--text-muted)] text-sm cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-4 bg-[var(--gold)] text-[#080808] text-base font-bold uppercase tracking-widest hover:bg-[#E4B429] transition-all duration-300 flex items-center justify-center gap-2',
              loading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[var(--text-subtle)] text-sm">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Social login */}
        <button className="w-full py-3.5 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] text-base font-medium hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Sign up link */}
        <p className="text-center text-[var(--text-muted)] text-base mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--gold)] hover:text-[#E4B429] font-medium transition-colors">
            Create one now
          </Link>
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--gold)]/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--gold)]/5 rounded-full blur-2xl" />
    </div>
  );
}
