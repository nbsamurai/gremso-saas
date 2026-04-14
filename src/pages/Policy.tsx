import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

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
            Last updated: March 6, 2026
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Shield className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Data Protection</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Lock className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Secure Storage</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Eye className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Transparency</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <FileText className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Compliance</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Introduction
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                At ZENTIVORA TECHNOLOGIES LTD, we take your privacy seriously.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our platform.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Please read this privacy policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the
                platform.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Information We Collect
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>Create an account</li>
                <li>Use our services</li>
                <li>Communicate with us</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                This information may include your name, email address, phone
                number, company information, and any other information you
                choose to provide.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                How We Use Your Information
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Data Security
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your information, we
                cannot guarantee its absolute security.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Your Rights
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to object to processing</li>
                <li>The right to data portability</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Third-Party Services
              </h2>
              <p className="text-[#6B7280] leading-relaxed">
                We may employ third-party companies and individuals to
                facilitate our service, provide service on our behalf, or assist
                us in analyzing how our service is used. These third parties
                have access to your personal information only to perform these
                tasks on our behalf and are obligated not to disclose or use it
                for any other purpose.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Changes to This Policy
              </h2>
              <p className="text-[#6B7280] leading-relaxed">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Contact Us
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="text-[#6B7280] space-y-2">
                <li>Email: privacy@zentivora.com</li>
                <li>Phone: +44 20 1234 5678</li>
                <li>Address: 28, City Road, London, EC1V 2NX, United Kingdom</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
