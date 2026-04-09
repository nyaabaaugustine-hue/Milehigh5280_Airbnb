import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create Account | The Palm',
  description: 'Join Milehigh5280 and unlock exclusive benefits for your Ghana stay.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
