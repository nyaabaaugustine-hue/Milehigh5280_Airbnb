import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Milehigh5280',
  description: 'How we handle and protect your data at Milehigh5280.',
};

export default function PrivacyPage() {
  return (
    <main className="pt-40 pb-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
      <header className="mb-16">
        <p className="section-label mb-4">Legal</p>
        <h1 className="font-serif font-light text-white leading-tight">
          Privacy <span className="italic text-gold-gradient">Policy</span>
        </h1>
      </header>

      <div className="max-w-3xl space-y-12 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-white mb-4">1. Information Collection</h2>
          <p>
            We collect information you provide directly to us when booking a stay or contacting our concierge. 
            This includes your name, email address, phone number, and any special requests or payment information.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">2. Use of Information</h2>
          <p>
            We use your data to process reservations, communicate check-in details, and improve our hospitality services. 
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">3. Data Security</h2>
          <p>
            We implement industry-standard security measures, including SSL encryption and secure payment processing 
            via Paystack and Stripe, to protect your sensitive data.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">4. Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience and remember your preferences, 
            such as your preferred currency (USD/GHS).
          </p>
        </section>

        <p className="text-xs pt-8 border-t border-[var(--border)]">
          Last updated: May 2024. For questions, contact herbertprempeh@gmail.com
        </p>
      </div>
    </main>
  );
}