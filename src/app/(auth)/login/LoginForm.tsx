'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, Shield, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[var(--obsidian)] via-[var(--surface)] to-[var(--obsidian)]">
      <div className="w-full max-w-[600px]">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors mb-6 text-sm sm:text-base"
        >
          <ArrowLeft size={18} />
          Back to home
        </Link>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-10 md:p-12 lg:p-14 rounded-2xl shadow-2xl shadow-black/30">
          {/* Logo */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 sm:border-3 border-[var(--gold)] shadow-xl shadow-[var(--gold)]/20">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
                alt="The Palm Logo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-[var(--text-muted)] text-center mb-8 sm:mb-10 text-base sm:text-lg">
            Sign in to your account
          </p>

          {/* Demo notice */}
          <div className="bg-gradient-to-r from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/30 p-4 sm:p-5 mb-8 sm:mb-10 rounded-xl">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-[var(--gold)]" />
              <p className="text-[var(--gold)] text-sm sm:text-base">
                Demo Mode — Use any email & password to explore
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[var(--text-muted)] text-sm sm:text-base mb-2 sm:mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-base sm:text-lg pl-12 pr-4 py-4 sm:py-5 rounded-xl outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <label htmlFor="password" className="text-[var(--text-muted)] text-sm sm:text-base">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[var(--gold)] hover:text-[#E4B429] text-sm sm:text-base transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-base sm:text-lg pl-12 pr-12 py-4 sm:py-5 rounded-xl outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                className="w-5 h-5 sm:w-6 sm:h-6 rounded border-[var(--border)] bg-[var(--surface-2)] text-[var(--gold)] focus:ring-[var(--gold)] focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-[var(--text-muted)] text-sm sm:text-base cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-4 sm:py-5 bg-gradient-to-r from-[var(--gold)] to-[#D4A843] text-[#080808] text-base sm:text-lg font-bold uppercase tracking-widest hover:from-[#D4A843] hover:to-[var(--gold)] transition-all duration-300 flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-[var(--gold)]/20',
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 sm:my-10">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[var(--text-subtle)] text-sm sm:text-base">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Social login */}
          <button className="w-full py-4 sm:py-5 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] text-base sm:text-lg font-medium hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all flex items-center justify-center gap-3 rounded-xl">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="text-center text-[var(--text-muted)] text-base sm:text-lg mt-8 sm:mt-10">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[var(--gold)] hover:text-[#E4B429] font-bold transition-colors">
              Create one now
            </Link>
          </p>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-[var(--text-subtle)]">
            <Shield size={14} />
            <span className="text-xs sm:text-sm">Secured with 256-bit encryption</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[var(--gold)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
