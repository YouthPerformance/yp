// ═══════════════════════════════════════════════════════════
// PRIVACY POLICY
// Barefoot Reset / YP Academy
// ═══════════════════════════════════════════════════════════

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Barefoot Reset and YP Academy',
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      {/* Header */}
      <header className="mb-12 not-prose">
        <p className="text-cyan-400 font-mono text-sm uppercase tracking-wider mb-2">
          Legal
        </p>
        <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-white mb-4">
          Privacy Policy
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
            Youth Performance ("YP", "we", "our", or "us") is committed to protecting
            your privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our website, mobile applications,
            and services (collectively, the "Services").
          </p>
          <p>
            Please read this Privacy Policy carefully. By using our Services, you consent
            to the collection and use of your information as described in this policy.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            2. Information We Collect
          </h2>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">
            Personal Information
          </h3>
          <p>We may collect personal information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email address, phone number)</li>
            <li>Account credentials (username and password)</li>
            <li>Profile information (age, sport, athletic goals)</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Parent/guardian information for users under 18</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">
            Usage Information
          </h3>
          <p>We automatically collect certain information when you use our Services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device information (device type, operating system)</li>
            <li>Log data (access times, pages viewed, IP address)</li>
            <li>Training activity and progress data</li>
            <li>App usage patterns and feature interactions</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Services</li>
            <li>Personalize your training experience</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent or unauthorized activity</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            4. Information Sharing
          </h2>
          <p>
            We do not sell your personal information. We may share your information in
            the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With service providers who assist in operating our Services</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
            <li>With your consent or at your direction</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            5. Children's Privacy
          </h2>
          <p>
            Our Services are designed to be used by children with parental consent.
            We comply with the Children's Online Privacy Protection Act (COPPA) and
            similar regulations.
          </p>
          <p>
            We require parental or guardian consent before collecting personal information
            from users under 13 years of age. Parents can review, update, or request
            deletion of their child's information by contacting us.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            6. Data Security
          </h2>
          <p>
            We implement appropriate technical and organizational measures to protect
            your personal information against unauthorized access, alteration, disclosure,
            or destruction.
          </p>
          <p>
            [Additional security details to be added by legal counsel]
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            7. Your Rights
          </h2>
          <p>Depending on your location, you may have rights regarding your personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and receive a copy of your data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict certain processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise these rights, please contact us at the email address below.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            8. Cookies and Tracking
          </h2>
          <p>
            We use cookies and similar technologies to collect information about your
            browsing activities and to personalize your experience. You can manage
            cookie preferences through your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of
            any material changes by posting the new policy on this page and updating
            the "Last Updated" date.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bebas tracking-wide text-white mb-4">
            10. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices,
            please contact us at:
          </p>
          <p className="font-mono text-cyan-400">
            legal@youthperformance.com
          </p>
        </div>
      </section>
    </article>
  );
}
