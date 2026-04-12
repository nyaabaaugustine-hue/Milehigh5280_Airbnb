import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Milehigh5280',
  description: 'Terms and conditions for Milehigh5280 stays.',
};

export default function TermsPage() {
  return (
    <main className="pt-40 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-light text-white mb-12">Terms of Service</h1>
      <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">1. Bookings</h2>
          <p>All reservations are subject to availability and require written confirmation from Milehigh Properties.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">2. Payment</h2>
          <p>Full payment is required to secure a reservation. We accept USD and GHS via Paystack and Stripe.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">3. Check-in</h2>
          <p>Standard check-in is 2:00 PM and check-out is 11:00 AM. Early/late arrangements subject to availability.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">4. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of Ghana.</p>
        </section>
        <div className="pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/" className="btn-ghost">Back Home</Link>
          <Link href="/cancellation" className="btn-ghost">Cancellation Policy</Link>
        </div>
      </div>
    </main>
  );
}