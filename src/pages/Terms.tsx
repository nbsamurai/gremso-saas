import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, Users, Scale, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#1F2937] mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-[#6B7280]">
            Last updated: March 6, 2026
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <FileText className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Agreement</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Users className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Guidelines</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Scale className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Dispute</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Liability</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Introduction
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Welcome to <strong>Gremso</strong>. The service is operated by{' '}
                <strong>Babu Lal Gurjar</strong>. By accessing and using our
                platform, you agree to be bound by these Terms and Conditions.
                Please read them carefully before using our services.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                If you do not agree with any part of these terms, you may not
                access our services.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                User Responsibilities
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                As a user of our platform, you agree to the following
                responsibilities:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Ensure your use complies with all applicable local, regional,
                  and national laws
                </li>
                <li>
                  Do not use the platform for unauthorized, illegal, or
                  malicious activities
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Acceptable Use Policy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                You must not misuse our services. You are strictly prohibited
                from:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Attempting to breach our security or authentication measures</li>
                <li>Uploading malware, viruses, or destructive code</li>
                <li>Interfering with the proper functioning of the platform</li>
                <li>
                  Copying or distributing our proprietary data and intellectual
                  property without written permission
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Payment Terms
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Select features of our platform require a subscription or
                one-off payment. By subscribing to <strong>Gremso</strong>,
                you agree to pay all applicable fees associated with the
                selected tier.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                We reserve the right to modify pricing with a 30-day notice to
                active users. Failure to maintain up-to-date payment
                information may result in temporary suspension of service.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Limitation of Liability
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                To the maximum extent permitted by law, Babu Lal Gurjar
                (operator of Gremso) shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Our platform is provided "as is" and "as available". We make no
                warranties, expressed or implied, regarding uptime, exact
                applicability to your unique operational workflow, or freedom
                from critical software bugs.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Contact Us
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <ul className="text-[#6B7280] space-y-2">
                <li>Email: support@gremso.com</li>
                <li>Operator: Babu Lal Gurjar (Gremso)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
