import type {MetaFunction} from '@shopify/remix-oxygen';
import {Link} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Terms of Service | YP Shop'},
    {description: 'Terms of Service for YP Shop'},
  ];
};

export default function TermsPage() {
  return (
    <main className="min-h-screen relative z-10 py-12">
      {/* Legal Navigation */}
      <nav className="border-b border-glow sticky top-0 bg-wolf-black/90 backdrop-blur-sm z-40 mb-12">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              to="/legal/terms"
              className="hero-subtitle text-cyan hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/legal/privacy"
              className="hero-subtitle hover:text-cyan transition-colors"
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
            Terms of Service
          </h1>
          <p className="font-mono text-sm text-dim">
            Last Updated: [Date]
          </p>
        </header>

        {/* Content */}
        <article className="space-y-10 text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to YP Shop ("we", "our", or "us"). These Terms of Service
              ("Terms") govern your access to and use of our online store and services
              (collectively, the "Services").
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms.
              If you do not agree to these Terms, please do not use our Services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              2. Eligibility
            </h2>
            <p className="mb-4">
              You must be at least 18 years old to make purchases on our store.
              Users under 18 must have parental or guardian permission to make purchases.
            </p>
            <p>
              [Additional eligibility requirements to be added by legal counsel]
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              3. Products and Orders
            </h2>
            <p className="mb-4">
              All product descriptions, images, and prices are subject to change without notice.
              We reserve the right to limit quantities or refuse orders at our discretion.
            </p>
            <p>
              [Additional product and order terms to be added by legal counsel]
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              4. Payment and Pricing
            </h2>
            <p className="mb-4">
              We accept various payment methods as indicated at checkout. All prices are
              listed in USD unless otherwise specified. You agree to pay all charges
              incurred by you or on your behalf through the Services.
            </p>
            <p>
              [Payment terms, taxes, and currency details to be added by legal counsel]
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              5. Shipping and Delivery
            </h2>
            <p className="mb-4">
              Shipping times and costs vary depending on your location and selected
              shipping method. Risk of loss and title for items purchased pass to
              you upon delivery to the carrier.
            </p>
            <p>
              [Shipping policy details to be added by legal counsel]
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              6. Returns and Refunds
            </h2>
            <p className="mb-4">
              We offer a 90-day satisfaction guarantee on our products. Please refer
              to our Returns Policy for detailed information on returns, exchanges,
              and refunds.
            </p>
            <p>
              [Returns policy details to be added by legal counsel]
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              7. Intellectual Property
            </h2>
            <p>
              All content, trademarks, and intellectual property on our Services are owned by
              Youth Performance or our licensors. You may not use, reproduce, or distribute
              our content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              [Limitation of liability provisions to be added by legal counsel]
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              9. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify you of any material
              changes by posting the new Terms on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-white mb-4">
              10. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-mono text-cyan">
              legal@youthperformance.com
            </p>
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
            <p className="text-dim">
              Youth Performance
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
