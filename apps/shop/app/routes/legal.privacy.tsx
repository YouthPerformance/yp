import { Link } from "@remix-run/react";
import type { MetaFunction } from "@shopify/remix-oxygen";

export const meta: MetaFunction = () => {
  return [{ title: "Privacy Policy | YP Shop" }, { description: "Privacy Policy for YP Shop" }];
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen relative z-10 py-12">
      {/* Legal Navigation */}
      <nav className="border-b border-glow sticky top-0 bg-wolf-black/90 backdrop-blur-sm z-40 mb-12">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/legal/terms" className="hero-subtitle hover:text-cyan transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/legal/privacy"
              className="hero-subtitle text-cyan hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12">
          <p className="hero-subtitle text-cyan mb-2">Legal</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white mb-4">
            Privacy Policy
          </h1>
          <p className="font-mono text-sm text-dim">Last Updated: [Date]</p>
        </header>

        {/* Content */}
        <article className="space-y-10 text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              Youth Performance ("YP Shop", "we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our online store and services (collectively, the
              "Services").
            </p>
            <p>
              Please read this Privacy Policy carefully. By using our Services, you consent to the
              collection and use of your information as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Personal Information</h3>
            <p className="mb-4">
              We may collect personal information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Name and contact information (email address, phone number)</li>
              <li>Shipping and billing address</li>
              <li>Payment information (processed securely through Shopify Payments)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              Automatically Collected Information
            </h3>
            <p className="mb-4">
              We automatically collect certain information when you visit our store:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (device type, operating system, browser)</li>
              <li>Log data (IP address, access times, pages viewed)</li>
              <li>Location data (based on IP address)</li>
              <li>Shopping behavior and browsing patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about orders and deliveries</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Analyze shopping trends and preferences</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              4. Information Sharing
            </h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Shopify (our e-commerce platform provider)</li>
              <li>Shipping carriers to deliver your orders</li>
              <li>Payment processors to handle transactions</li>
              <li>Analytics providers to understand how you use our Services</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              5. Data Security
            </h2>
            <p className="mb-4">
              We use industry-standard security measures to protect your personal information. Our
              store is built on Shopify, which employs robust security protocols including SSL
              encryption for all data transmission.
            </p>
            <p>[Additional security details to be added by legal counsel]</p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">6. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and receive a copy of your data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to certain data processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              7. Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar technologies to enhance your shopping experience, remember
              your preferences, and analyze site traffic. You can manage cookie preferences through
              your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              8. Third-Party Links
            </h2>
            <p>
              Our store may contain links to third-party websites. We are not responsible for the
              privacy practices of these external sites. We encourage you to review their privacy
              policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the new policy on this page and updating the "Last
              Updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please
              contact us at:
            </p>
            <p className="font-mono text-cyan">legal@youthperformance.com</p>
          </section>
        </article>

        {/* Footer */}
        <footer className="border-t border-glow mt-16 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-dim">
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-white transition-colors">
                Back to Shop
              </Link>
              <span className="text-gray-700">|</span>
              <a
                href="mailto:legal@youthperformance.com"
                className="hover:text-cyan transition-colors"
              >
                legal@youthperformance.com
              </a>
            </div>
            <p className="text-dim">Youth Performance</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
