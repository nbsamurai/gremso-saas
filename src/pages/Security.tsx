import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Server, Mail } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#1F2937] mb-6">
            Security Overview
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
              <h3 className="font-semibold text-[#1F2937]">Commitment</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Lock className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Data protection</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Server className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Infrastructure</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Mail className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Report issues</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <p className="text-[#6B7280] leading-relaxed mb-4">
                At Gremso, security is a top priority. We are committed to
                protecting your data, ensuring platform reliability, and
                maintaining a secure environment for all users.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Gremso is accessible at:{' '}
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
              <p className="text-[#6B7280] leading-relaxed">
                This service is owned and operated by{' '}
                <strong>Babu Lal Gurjar</strong>.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                1. Our Security Commitment
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We take appropriate technical and organizational measures to
                protect:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>User data</li>
                <li>Project files and documents</li>
                <li>Account information</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                Our goal is to provide a secure and reliable SaaS platform for
                team and project management.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                2. Data Protection
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We implement safeguards to protect your data, including:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Encryption of data during transmission (HTTPS/SSL)</li>
                <li>Secure storage practices</li>
                <li>Access control mechanisms</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                Sensitive information such as payment details is not stored
                directly by us and is handled by trusted third-party providers
                (e.g., Creem).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                3. Account Security
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                To protect your account:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Passwords are stored securely (encrypted/hashed)</li>
                <li>
                  Users are responsible for maintaining password confidentiality
                </li>
                <li>We recommend using strong, unique passwords</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                We may restrict access or suspend accounts in case of suspicious
                activity.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                4. Payment Security
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                All payments are processed through secure third-party payment
                gateways such as Creem.
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>We do not store full card details</li>
                <li>Payment processing follows industry security standards</li>
                <li>Transactions are encrypted</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                5. Infrastructure &amp; Hosting Security
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Our platform is hosted on reliable cloud infrastructure
                providers.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                Security measures include:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Firewall protection</li>
                <li>Monitoring systems</li>
                <li>Regular updates and patching</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                6. Data Access Control
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We restrict access to user data:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Only authorized systems and processes can access data</li>
                <li>Internal access is limited and controlled</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                7. Monitoring &amp; Threat Detection
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We monitor systems to detect:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Unauthorized access attempts</li>
                <li>Suspicious activity</li>
                <li>Potential vulnerabilities</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                8. Data Backup &amp; Reliability
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We take steps to ensure data availability:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Regular backups</li>
                <li>System reliability practices</li>
                <li>Recovery mechanisms in case of failure</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                9. User Responsibilities
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Users play an important role in maintaining security.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">You agree to:</p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Keep your login credentials secure</li>
                <li>Not share your account access</li>
                <li>Report suspicious activity immediately</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                10. Third-Party Services
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We may rely on trusted third-party services (e.g., payment
                processors, hosting providers).
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                While we select reputable providers, we are not responsible for
                their independent security practices.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                11. Limitations
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                While we implement strong security practices:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>No system is completely secure</li>
                <li>We cannot guarantee absolute security</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                Users acknowledge this risk when using the platform.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                12. Reporting Security Issues
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                If you discover a vulnerability or security issue, please report
                it immediately:
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                <a
                  href="mailto:support@gremso.com"
                  className="text-lg font-semibold text-[#1F2937] underline underline-offset-2 hover:no-underline"
                >
                  support@gremso.com
                </a>
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                We take all reports seriously and will investigate promptly.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                13. Updates to This Page
              </h2>
              <p className="text-[#6B7280] leading-relaxed">
                We may update this Security Overview from time to time to reflect
                improvements or changes.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                14. Contact Information
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
