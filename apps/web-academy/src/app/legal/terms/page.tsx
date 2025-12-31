// ═══════════════════════════════════════════════════════════
// TERMS OF SERVICE
// Barefoot Reset / YP Academy
// ═══════════════════════════════════════════════════════════

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Barefoot Reset and YP Academy',
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      {/* Header */}
      <header className="mb-12 not-prose">
        <p className="text-cyan-400 font-mono text-sm uppercase tracking-wider mb-2">
          Legal
        </p>
        <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Last Updated: [Date]
        </p>
      </header>

      {/* Content */}
      <section className="space-y-8 text-gray-300">
        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            1. Introduction
          </h2>
          <p>
            Welcome to Youth Performance ("YP", "we", "our", or "us"). These Terms of Service
            ("Terms") govern your access to and use of our website, mobile applications,
            and services including the Barefoot Reset training program (collectively, the "Services").
          </p>
          <p>
            By accessing or using our Services, you agree to be bound by these Terms. If you
            do not agree to these Terms, please do not use our Services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            2. Eligibility
          </h2>
          <p>
            Our Services are designed for youth athletes and their parents or guardians.
            Users under 18 years of age must have parental or guardian consent to use our Services.
          </p>
          <p>
            [Additional eligibility requirements to be added by legal counsel]
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            3. User Accounts
          </h2>
          <p>
            To access certain features of our Services, you may be required to create an account.
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activities that occur under your account.
          </p>
          <p>
            [Additional account terms to be added by legal counsel]
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            4. Subscription and Payments
          </h2>
          <p>
            Some of our Services require a paid subscription. By subscribing, you agree to pay
            the applicable fees and authorize us to charge your payment method on a recurring basis.
          </p>
          <p>
            [Subscription terms, billing cycles, and refund policies to be added by legal counsel]
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            5. Acceptable Use
          </h2>
          <p>
            You agree to use our Services only for lawful purposes and in accordance with these Terms.
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Services in any way that violates applicable laws or regulations</li>
            <li>Share your account credentials with others</li>
            <li>Attempt to interfere with the proper functioning of the Services</li>
            <li>Copy, modify, or distribute our content without authorization</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            6. Intellectual Property
          </h2>
          <p>
            All content, trademarks, and intellectual property on our Services are owned by
            Youth Performance or our licensors. You may not use, reproduce, or distribute
            our content without prior written permission.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            7. Health and Safety Disclaimer
          </h2>
          <p>
            The training programs and exercises provided through our Services are for
            informational and educational purposes only. Always consult with a healthcare
            provider before starting any new exercise program.
          </p>
          <p>
            Youth Performance is not responsible for any injuries that may occur during
            the use of our training programs. Users participate at their own risk.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            8. Limitation of Liability
          </h2>
          <p>
            [Limitation of liability provisions to be added by legal counsel]
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            9. Changes to Terms
          </h2>
          <p>
            We may update these Terms from time to time. We will notify you of any material
            changes by posting the new Terms on this page and updating the "Last Updated" date.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            10. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="font-mono text-cyan-400">
            legal@youthperformance.com
          </p>
        </div>
      </section>
    </article>
  );
}
