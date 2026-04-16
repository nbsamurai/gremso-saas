import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, ListChecks, Lock, UserCheck } from 'lucide-react';

export default function Policy() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#1F2937] mb-6">
            Privacy Policy
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
              <Shield className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Your privacy</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <ListChecks className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">What we collect</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Lock className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Security</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <UserCheck className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Your rights</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Welcome to <strong>Gremso</strong> (&quot;we,&quot; &quot;our,&quot;
                &quot;us&quot;), accessible at:
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
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our platform.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                This website and service are owned and operated by{' '}
                <strong>Babu Lal Gurjar</strong>.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                By using Gremso, you agree to this Privacy Policy.
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
                2. Information We Collect
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We may collect the following types of information:
              </p>

              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                a. Personal Information
              </h3>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-6">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number (if provided)</li>
                <li>Billing details</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                b. Account &amp; Usage Data
              </h3>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-6">
                <li>Login credentials</li>
                <li>Projects, files, and documents you upload</li>
                <li>Activity within the platform</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                c. Payment Information
              </h3>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-6">
                <li>
                  Payments are processed securely via third-party providers
                  (such as Creem)
                </li>
                <li>
                  We do not store full card details or sensitive payment
                  information
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                d. Technical Data
              </h3>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Cookies and usage analytics</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We use your data to:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Provide and maintain our services</li>
                <li>Manage your account</li>
                <li>Process subscriptions and payments</li>
                <li>Improve platform functionality</li>
                <li>
                  Communicate updates, support, and service-related notices
                </li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                4. Cookies &amp; Tracking Technologies
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Enhance user experience</li>
                <li>Analyze traffic and usage patterns</li>
                <li>Remember user preferences</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                You can control or disable cookies through your browser settings.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                5. Sharing of Information
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We do not sell your personal data.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We may share your data with:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Payment processors (e.g., Creem)</li>
                <li>Hosting and cloud service providers</li>
                <li>Analytics providers</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                All third parties are required to handle your data securely.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                6. Data Retention
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We retain your data:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>As long as your account is active</li>
                <li>As necessary for legal or regulatory compliance</li>
                <li>Until you request deletion</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                7. Data Security
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We implement reasonable technical and organizational measures to
                protect your data.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                However, no method of transmission or storage is completely
                secure.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                8. Your Rights
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                Depending on applicable laws, you may have the right to:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                To exercise your rights, contact us at:{' '}
                <a
                  href="mailto:support@gremso.com"
                  className="font-semibold text-[#1F2937] underline underline-offset-2 hover:no-underline"
                >
                  support@gremso.com
                </a>
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                9. Third-Party Services
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Gremso may integrate with third-party tools and services.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                We are not responsible for their privacy practices. Please review
                their policies separately.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Gremso is not intended for individuals under the age of 18.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                We do not knowingly collect data from children.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                11. International Data Transfers
              </h2>
              <p className="text-[#6B7280] leading-relaxed">
                If you access Gremso from outside India, your data may be
                transferred to and processed in India.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                12. Changes to This Privacy Policy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We may update this Privacy Policy from time to time.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Updates will be posted on this page with a revised &quot;Last
                Updated&quot; date.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                13. Contact Us
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                If you have any questions about this Privacy Policy:
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
