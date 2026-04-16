import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Building2,
  Cloud,
  CreditCard,
  Scale,
} from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#1F2937] mb-6">
            Terms and Conditions
          </h1>
          <p className="text-xl text-[#6B7280]">
            Last updated: April 16, 2026
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Building2 className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Business</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Cloud className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Services</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <CreditCard className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Billing</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Scale className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Legal</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Welcome to <strong>Gremso</strong> (&quot;we,&quot; &quot;our,&quot;
                &quot;us&quot;). These Terms and Conditions govern your use of our
                website and SaaS platform available at:
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                <strong>
                  <a
                    href="https://gremso.com/"
                    className="text-[#1F2937] underline underline-offset-2 hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://gremso.com/
                  </a>
                </strong>
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                This website and service are owned and operated by{' '}
                <strong>Babu Lal Gurjar</strong>.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                By accessing or using Gremso, you agree to these Terms. If you do
                not agree, please do not use our services.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                1. Business Information
              </h2>
              <ul className="list-none text-[#6B7280] space-y-2">
                <li>
                  <strong className="text-[#1F2937]">Business Name:</strong>{' '}
                  Gremso
                </li>
                <li>
                  <strong className="text-[#1F2937]">Owner:</strong> Babu Lal
                  Gurjar
                </li>
                <li>
                  <strong className="text-[#1F2937]">Address:</strong>
                  <span className="block mt-1 pl-0 sm:pl-4 whitespace-pre-line">
                    {`S/O: Prabhu Dayal Gurjar
Balwanta, Rajosi
Ajmer, Rajasthan – 305401
India`}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                2. Use of Services
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Gremso provides a cloud-based team and project management platform
                designed for construction and operational teams.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">You agree to:</p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Use the platform only for lawful purposes</li>
                <li>Provide accurate account information</li>
                <li>Not misuse, copy, or disrupt the service</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate
                these terms.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                3. Account Registration
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                To access certain features, you must create an account.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Maintaining confidentiality of login credentials</li>
                <li>All activities under your account</li>
                <li>Notifying us of unauthorized access</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                4. Subscription &amp; Payments
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Gremso operates on a subscription-based model.
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>
                  Payments are processed securely via third-party providers
                  (including Creem or similar gateways)
                </li>
                <li>By purchasing a plan, you authorize recurring billing</li>
                <li>Prices may change with prior notice</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                Failure to pay may result in:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Suspension of services</li>
                <li>Loss of access to data after a grace period</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                5. Refund Policy
              </h2>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>
                  Payments are generally non-refundable, unless required by law
                </li>
                <li>In case of billing errors, contact us within 7 days</li>
                <li>
                  Refunds, if applicable, are processed through the original
                  payment method
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                6. Free Trials (if applicable)
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                If a free trial is offered:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>You will not be charged during the trial period</li>
                <li>
                  After the trial ends, billing starts automatically unless
                  canceled
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                7. User Data &amp; Privacy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We respect your privacy.
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Your data is stored securely</li>
                <li>We do not sell your personal data</li>
                <li>
                  Data handling is governed by our{' '}
                  <Link
                    to="/privacy"
                    className="text-[#1F2937] underline underline-offset-2 hover:no-underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                You are responsible for the data you upload to Gremso.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                All content, software, and branding of Gremso are owned by{' '}
                <strong>Babu Lal Gurjar</strong>.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">You may not:</p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Copy or resell the platform</li>
                <li>Reverse-engineer or exploit the software</li>
                <li>Use our branding without permission</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                9. Service Availability
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We aim for high uptime but do not guarantee uninterrupted service.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We are not liable for:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Downtime</li>
                <li>Data loss due to external factors</li>
                <li>Third-party service failures</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                To the maximum extent permitted by law, Gremso shall not be liable
                for:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Indirect or incidental damages</li>
                <li>Loss of business, profits, or data</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                Our total liability will not exceed the amount paid by you in the
                last 30 days.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                11. Termination
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We may suspend or terminate your account if:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>You violate these terms</li>
                <li>You fail to make payments</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                You may cancel your subscription anytime.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                12. Third-Party Services
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Gremso may integrate with third-party tools.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We are not responsible for:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Their performance</li>
                <li>Their policies or data handling</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We may update these Terms at any time.
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Changes will be posted on this page</li>
                <li>Continued use means acceptance of updated terms</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                14. Governing Law
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                These Terms shall be governed by the laws of{' '}
                <strong>India</strong>.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Any disputes will be subject to the jurisdiction of courts in{' '}
                <strong>Rajasthan, India</strong>.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                15. Contact Us
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                For questions or support:
              </p>
              <ul className="list-none text-[#6B7280] space-y-2">
                <li>
                  <strong className="text-[#1F2937]">Business Name:</strong>{' '}
                  Gremso
                </li>
                <li>
                  <strong className="text-[#1F2937]">Owner:</strong> Babu Lal
                  Gurjar
                </li>
                <li>
                  <strong className="text-[#1F2937]">Email:</strong>{' '}
                  <a
                    href="mailto:support@gremso.com"
                    className="text-[#1F2937] underline underline-offset-2 hover:no-underline"
                  >
                    support@gremso.com
                  </a>
                </li>
                <li>
                  <strong className="text-[#1F2937]">Address:</strong>
                  <span className="block mt-1 pl-0 sm:pl-4 whitespace-pre-line">
                    {`S/O: Prabhu Dayal Gurjar
Balwanta, Rajosi
Ajmer, Rajasthan – 305401
India`}
                  </span>
                </li>
                <li>
                  <strong className="text-[#1F2937]">Website:</strong>{' '}
                  <a
                    href="https://gremso.com/"
                    className="text-[#1F2937] underline underline-offset-2 hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://gremso.com/
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
