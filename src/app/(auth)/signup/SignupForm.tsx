'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield } from 'lucide-react';

export default function SignupForm() {
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

      <h1 className="text-2xl font-serif text-white mb-2">Registration Closed</h1>
      <p className="text-white/50 mb-8 text-sm">
        Public registration is currently disabled. Please contact the administrator for access.
      </p>

      {/* Contact info */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
        <p className="text-white/60 text-sm mb-2">For admin access:</p>
        <p className="text-white/80 text-sm">Email: admin@milehigh5280.com</p>
      </div>

      {/* Login link */}
      <p className="text-center text-white/50 text-sm">
        Already have access?{' '}
        <Link href="/login" className="text-[var(--gold)] hover:text-[#E4B429] font-medium">
          Sign in
        </Link>
      </p>

      {/* Back to home */}
      <p className="text-center text-white/40 text-sm mt-6">
        <Link href="/" className="hover:text-white/60 transition-colors">
          ← Back to home
        </Link>
      </p>

      {/* Security */}
      <div className="flex items-center justify-center gap-2 mt-6 text-white/30">
        <Shield size={12} />
        <span className="text-xs">Secure admin access</span>
      </div>
    </div>
  );
}