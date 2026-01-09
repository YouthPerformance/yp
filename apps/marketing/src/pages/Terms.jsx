import { Link } from "react-router-dom";

/**
 * Terms of Service Page
 * YP Academy / Marketing Site
 */
function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Legal Navigation */}
      <nav className="border-b border-neutral-800 bg-black/90 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em] hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <p className="text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] mb-2">Legal</p>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-white mb-4">
            Terms of Service
          </h1>
          <p className="font-mono text-sm text-neutral-500">Last Updated: [Date]</p>
        </header>

        {/* Content */}
        <article className="space-y-10 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Youth Performance ("YP", "we", "our", or "us"). These Terms of Service
              ("Terms") govern your access to and use of our website, applications, training
              programs, and services (collectively, the "Services").
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms. If you do
              not agree to these Terms, please do not use our Services.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">2. Eligibility</h2>
            <p className="mb-4">
              Our Services are designed for youth athletes and their parents or guardians. Users
              under 18 years of age must have parental or guardian consent to use our Services.
            </p>
            <p>[Additional eligibility requirements to be added by legal counsel]</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of our Services, you may be required to create an account.
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account.
            </p>
            <p>[Additional account terms to be added by legal counsel]</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">
              4. Subscription and Payments
            </h2>
            <p className="mb-4">
              Some of our Services require a paid subscription. By subscribing, you agree to pay the
              applicable fees and authorize us to charge your payment method on a recurring basis.
            </p>
            <p>
              [Subscription terms, billing cycles, and refund policies to be added by legal counsel]
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">5. Acceptable Use</h2>
            <p className="mb-4">
              You agree to use our Services only for lawful purposes and in accordance with these
              Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Services in any way that violates applicable laws or regulations</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to interfere with the proper functioning of the Services</li>
              <li>Copy, modify, or distribute our content without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">
              6. Training Content and Programs
            </h2>
            <p className="mb-4">
              Our training programs, including AskYP AI Coach, Training Packs, and other content,
              are provided for educational and informational purposes. Results may vary based on
              individual effort and other factors.
            </p>
            <p>[Additional content terms to be added by legal counsel]</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">
              7. Health and Safety Disclaimer
            </h2>
            <p className="mb-4">
              The training programs and exercises provided through our Services are for
              informational and educational purposes only. Always consult with a healthcare provider
              before starting any new exercise program.
            </p>
            <p>
              Youth Performance is not responsible for any injuries that may occur during the use of
              our training programs. Users participate at their own risk.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">
              8. Intellectual Property
            </h2>
            <p>
              All content, trademarks, and intellectual property on our Services are owned by Youth
              Performance or our licensors. You may not use, reproduce, or distribute our content
              without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">
              9. Limitation of Liability
            </h2>
            <p>[Limitation of liability provisions to be added by legal counsel]</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">
              10. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify you of any material
              changes by posting the new Terms on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wide text-white mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-mono text-cyan-400">legal@youthperformance.com</p>
          </section>
        </article>

        {/* Footer */}
        <footer className="border-t border-neutral-800 mt-16 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-white transition-colors">
                Back to Home
              </Link>
              <span className="text-neutral-700">|</span>
              <a
                href="mailto:legal@youthperformance.com"
                className="hover:text-cyan-400 transition-colors"
              >
                legal@youthperformance.com
              </a>
            </div>
            <p className="text-neutral-600">Youth Performance</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Terms;
