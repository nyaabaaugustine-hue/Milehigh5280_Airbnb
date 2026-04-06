import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative */}
      <div className="relative mb-8">
        <span className="font-serif text-[12rem] font-light text-[var(--surface-2)] leading-none select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border border-[var(--gold)] rotate-45 opacity-60" />
        </div>
      </div>

      <p className="section-label mb-4">Page Not Found</p>
      <h1 className="font-serif text-4xl font-light text-white mb-4">
        This page doesn&apos;t exist
      </h1>
      <p className="text-[var(--text-muted)] max-w-sm mb-8 leading-relaxed">
        It may have been moved or the address is incorrect.
        Let us guide you back to the experience you deserve.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn-gold">
          <ArrowLeft size={14} />
          Return Home
        </Link>
        <Link href="/properties" className="btn-ghost">
          View Properties
        </Link>
      </div>
    </div>
  );
}
