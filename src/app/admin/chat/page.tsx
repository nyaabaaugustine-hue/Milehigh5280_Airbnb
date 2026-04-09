import type { Metadata } from 'next';
import AdminChat from '@/components/admin/AdminChat';
import { Bot, ShieldCheck, Zap, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Assistant | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default function AdminChatPage() {
  return (
    <div className="flex flex-col h-full gap-6">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center">
              <Bot size={20} className="text-[var(--gold)]" />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-white leading-tight">AI Content Assistant</h1>
              <p className="text-[var(--text-muted)] text-xs">Chat-driven CMS — safely update your website in plain English</p>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { Icon: ShieldCheck, label: 'Confirm before execute' },
            { Icon: Zap,         label: 'Updates Airtable CMS' },
            { Icon: History,     label: 'Full action log' },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-[var(--text-muted)] text-xs"
            >
              <Icon size={12} className="text-[var(--gold)]" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            step: '01',
            title: 'You type in plain English',
            desc: '"Change the nightly price to $75" or "Update the homepage headline"',
          },
          {
            step: '02',
            title: 'AI interprets & previews',
            desc: 'Shows you exactly what will change, the risk level, and the Airtable fields affected',
          },
          {
            step: '03',
            title: 'You confirm to apply',
            desc: 'Nothing changes until you click Confirm. All actions are logged with before/after values',
          },
        ].map(({ step, title, desc }) => (
          <div key={step} className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
            <span className="font-mono text-[var(--gold)] text-xs opacity-60">{step}</span>
            <h3 className="text-white text-sm font-medium mt-1 mb-1">{title}</h3>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Chat UI ── */}
      <div className="flex-1 min-h-[500px]" style={{ height: 'calc(100vh - 340px)' }}>
        <AdminChat />
      </div>

    </div>
  );
}
