import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Milehigh5280',
  description: 'Cancellation and refund policy for Milehigh5280.',
};

export default function CancellationPage() {
  return (
    <main className="pt-40 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-light text-white mb-12">Cancellation Policy</h1>
      <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-white mb-5">Refund Schedule</h2>
          <div className="space-y-3">
            <div className="flex justify-between border border-[var(--border)] p-4">
              <span className="text-white">7 or more days before check-in</span>
              <span className="text-[var(--gold)] font-medium">Full refund</span>
            </div>
            <div className="flex justify-between border border-[var(--border)] p-4">
              <span className="text-white">3 to 6 days before check-in</span>
              <span className="text-[var(--gold)] font-medium">50% refund</span>
            </div>
            <div className="flex justify-between border border-[var(--border)] p-4">
              <span className="text-white">Less than 48 hours</span>
              <span className="text-[var(--gold)] font-medium">No refund</span>
            </div>
          </div>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">How to Cancel</h2>
          <p>Contact us via WhatsApp or email. Refunds are processed within 5 to 10 business days.</p>
        </section>
        <div className="pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/" className="btn-ghost">Back Home</Link>
          <Link href="/contact" className="btn-ghost">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}