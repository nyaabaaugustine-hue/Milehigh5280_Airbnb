'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const benefits = [
  'Exclusive member-only rates',
  'Faster booking experience',
  'Save your favorite properties',
  'View your booking history',
];

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Signup failed');
      }

      toast.success('Account created successfully!');
      router.push('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed');
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
          Create Account
        </h1>
        <p className="text-[var(--text-muted)] text-center mb-6 text-base">
          Join Milehigh5280 for exclusive benefits
        </p>

        {/* Benefits */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4 mb-6 grid grid-cols-2 gap-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <Check size={14} className="text-[var(--gold)] shrink-0" />
              <span className="text-[var(--text-muted)] text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-[var(--text-muted)] text-sm mb-2">
                First Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First"
                  required
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] pl-10 pr-3 py-3 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-[var(--text-muted)] text-sm mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last"
                required
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-3 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[var(--text-muted)] text-sm mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] pl-10 pr-3 py-3 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-[var(--text-muted)] text-sm mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] pl-10 pr-3 py-3 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[var(--text-muted)] text-sm mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] pl-10 pr-12 py-3 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-[var(--text-muted)] text-sm mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] pl-10 pr-3 py-3 text-base outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-2">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-5 h-5 mt-0.5 rounded border-[var(--border)] bg-[var(--surface-2)] text-[var(--gold)] focus:ring-[var(--gold)] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-[var(--text-muted)] text-sm leading-relaxed cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" className="text-[var(--gold)] hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[var(--gold)] hover:underline">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-4 bg-[var(--gold)] text-[#080808] text-base font-bold uppercase tracking-widest hover:bg-[#E4B429] transition-all flex items-center justify-center gap-2 mt-4',
              loading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[var(--text-subtle)] text-sm">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Social signup */}
        <button className="w-full py-3.5 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] text-base font-medium hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Login link */}
        <p className="text-center text-[var(--text-muted)] text-base mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--gold)] hover:text-[#E4B429] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--gold)]/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--gold)]/5 rounded-full blur-2xl" />
    </div>
  );
}
