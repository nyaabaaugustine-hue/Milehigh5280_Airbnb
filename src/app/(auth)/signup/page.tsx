import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create Account | The Palm',
  description: 'Join Milehigh5280 and unlock exclusive benefits for your Ghana stay.',
};

export default function SignupPage() {
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
        <SignupForm />
      </div>
    </div>
  );
}
