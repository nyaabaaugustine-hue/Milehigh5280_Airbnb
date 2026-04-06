'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ComingSoonSignupProps {
  propertyName: string;
}

export default function ComingSoonSignup({ propertyName }: ComingSoonSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setStatus('success');
      toast.success("You've been added to the waitlist.");
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="border border-[var(--gold)] p-10 bg-[var(--surface)] text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={28} className="text-[var(--gold)]" />
        </div>
        <h3 className="font-serif text-3xl text-white mb-3">You're on the list</h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          Thank you for your interest. We will notify you via <strong>{email}</strong> the moment 
          bookings for <strong>{propertyName}</strong> become available.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border)] p-8 bg-[var(--surface)]">
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-white mb-2">Join the Waitlist</h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          Final refinements are underway. Be the first to secure your dates when 
          <strong> {propertyName}</strong> opens for luxury bookings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <Mail 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] transition-transform group-focus-within:scale-110" 
            size={16} 
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="input-luxury pl-12 w-full text-sm py-4"
            required
            disabled={status === 'loading'}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            "btn-gold w-full flex items-center justify-center gap-3 py-4 transition-all active:scale-[0.98]",
            status === 'loading' && "opacity-80 cursor-not-allowed"
          )}
        >
          {status === 'loading' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={14} className="group-hover:translate-x-1 transition-transform" />
          )}
          <span className="uppercase tracking-widest text-[0.65rem] font-bold">
            {status === 'loading' ? 'Processing...' : 'Notify Me'}
          </span>
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <p className="text-[var(--text-subtle)] text-[0.6rem] text-center leading-relaxed">
          Milehigh Properties values your privacy. By subscribing, you agree to our 
          <a 
            href="/privacy" 
            className="text-[var(--gold)] hover:underline ml-1 font-medium"
          >
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}