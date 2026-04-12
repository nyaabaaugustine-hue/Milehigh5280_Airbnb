import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Milehigh5280',
  description: 'How we handle your data at Milehigh5280.',
};

export default function PrivacyPage() {
  return (
    <main className="pt-40 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-light text-white mb-12">Privacy Policy</h1>
      <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">1. Information We Collect</h2>
          <p>We collect your name, email, phone, and payment details when you book or contact us.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">2. How We Use It</h2>
          <p>Your data is used only to process bookings and improve our service. We never sell personal information.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">3. Security</h2>
          <p>We use SSL encryption and process payments securely via Paystack and Stripe.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">4. Contact</h2>
          <p>Questions: <a href="mailto:herbertprempeh@gmail.com" className="text-[var(--gold)] hover:underline">herbertprempeh@gmail.com</a></p>
        </section>
        <div className="pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/" className="btn-ghost">Back Home</Link>
          <Link href="/terms" className="btn-ghost">Terms of Service</Link>
        </div>
      </div>
    </main>
  );
}