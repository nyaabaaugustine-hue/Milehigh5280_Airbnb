import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Welcome Back | The Palm',
  description: 'Sign in to your Milehigh5280 account to manage your bookings and preferences.',
};

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/auth-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#0f172a',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
