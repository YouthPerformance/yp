// ═══════════════════════════════════════════════════════════
// SIGN UP PAGE
// Clerk authentication
// ═══════════════════════════════════════════════════════════

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-[#0A0A0A] border border-[#2A2A2A]',
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/role"
      />
    </div>
  );
}
