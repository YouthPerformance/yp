// ===================================================================
// CHECKOUT SUCCESS PAGE
// Shown after successful Stripe payment
// ===================================================================

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserContext } from '@/contexts/UserContext';

interface SessionStatus {
  status: string;
  customerEmail: string | null;
}

// Loading fallback for Suspense
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="w-12 h-12 border-4 border-current border-t-transparent rounded-full"
        style={{ color: 'var(--accent-primary)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// Inner component that uses useSearchParams
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refetch } = useUserContext();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.push('/home');
      return;
    }

    // Fetch session status
    fetch(`/api/checkout?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setSessionStatus(data);
        setLoading(false);
        // Trigger a refetch of user data to get updated subscription
        refetch();
      })
      .catch(() => {
        setLoading(false);
      });
  }, [sessionId, router, refetch]);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const isPaid = sessionStatus?.status === 'paid';

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full rounded-3xl p-8 text-center"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {isPaid ? (
          <>
            {/* Success Icon */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #00a3b8 100%)',
                boxShadow: '0 0 60px rgba(0, 246, 224, 0.4)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            >
              <motion.span
                className="text-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                &#10003;
              </motion.span>
            </motion.div>

            <h1
              className="font-bebas text-4xl tracking-wider mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              WELCOME TO THE PACK
            </h1>

            <p
              className="text-lg mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your transformation begins now, {user?.name || 'Athlete'}!
            </p>

            <div
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: 'rgba(0, 246, 224, 0.1)',
                border: '1px solid rgba(0, 246, 224, 0.3)',
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--accent-primary)' }}
              >
                Barefoot Reset - 42 Day Program
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Full access unlocked
              </p>
            </div>

            <motion.button
              onClick={() => router.push('/home')}
              className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              START TRAINING
            </motion.button>

            <p
              className="text-xs mt-4"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Redirecting in 5 seconds...
            </p>
          </>
        ) : (
          <>
            {/* Pending/Error State */}
            <div className="text-6xl mb-6">&#128260;</div>

            <h1
              className="font-bebas text-3xl tracking-wider mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              PROCESSING PAYMENT
            </h1>

            <p
              className="text-sm mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your payment is being processed. This may take a moment.
            </p>

            <motion.button
              onClick={() => router.push('/home')}
              className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              GO TO DASHBOARD
            </motion.button>
          </>
        )}
      </motion.div>
    </main>
  );
}

// Main page component with Suspense boundary
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
