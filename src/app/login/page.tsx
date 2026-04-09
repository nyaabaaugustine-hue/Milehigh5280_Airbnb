import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Welcome Back | The Palm',
  description: 'Sign in to your Milehigh5280 account to manage your bookings and preferences.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
