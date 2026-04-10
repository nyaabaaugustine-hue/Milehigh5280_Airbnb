import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Milehigh5280',
  description: 'Luxury Accommodation in Ghana',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775819520/Banner-1_bk1oka.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Global Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[480px]">
        {children}
      </div>
    </div>
  );
}
