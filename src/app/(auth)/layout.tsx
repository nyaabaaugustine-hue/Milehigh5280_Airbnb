import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Milehigh5280',
  description: 'Luxury Accommodation in Ghana',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--obsidian)] flex flex-col">
      {children}
    </div>
  );
}
