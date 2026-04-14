import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldAlert, Server, Fingerprint, Activity } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Security Overview
          </h1>
          <p className="text-xl text-gray-500">
            Last updated: March 6, 2026
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <ShieldAlert className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Encryption</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Server className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Infrastructure</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Fingerprint className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Access Control</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Activity className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Compliance</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Enterprise-Grade Security
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                At ZENTIVORA TECHNOLOGIES LTD, the security and reliability of
                your data is our highest priority. We employ state-of-the-art
                security practices to ensure your construction and productivity
                data remains strictly confidential and continuously available.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Data Encryption
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Any data that travels between your device and our servers is
                encrypted in transit using industry-standard TLS 1.3 (Transport
                Layer Security).
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2 mb-4">
                <li>Data at rest is encrypted using AES-256 encryption.</li>
                <li>
                  Encryption keys are strictly managed and rotated frequently
                  using hardware security modules (HSMs).
                </li>
                <li>Database instances and file backups are identically secured.</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Infrastructure Security
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Our infrastructure resides in secure AWS data centers protected
                by biometric locks, armed guards, and surveillance.
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2">
                <li>
                  We deploy across multiple availability zones to ensure fault
                  tolerance.
                </li>
                <li>
                  Our VPCs (Virtual Private Clouds) isolate our databases
                  entirely from public internet access.
                </li>
                <li>
                  We conduct regular disaster recovery exercises and backup
                  integrity checks.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Access Controls
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We employ the principle of least privilege (PoLP) internally.
                Access to production environments is strictly limited to
                authorized senior engineers requiring it to maintain platform
                operations.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Multi-factor authentication (MFA) is strictly enforced across
                all internal operational services.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Vulnerability Reporting
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We believe that working closely with the security research
                community helps keep our users safer.
              </p>
              <p className="text-gray-500 leading-relaxed">
                If you have discovered a security vulnerability on ZENTIVORA
                TECHNOLOGIES LTD, we encourage you to contact us immediately on
                our secure reporting line.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Contact Security Team
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                To report an incident or inquire about our security policies:
              </p>
              <ul className="text-gray-500 space-y-2">
                <li>Email: security@zentivora.com</li>
                <li>
                  Company: ZENTIVORA TECHNOLOGIES LTD (Company Number: 17049974)
                </li>
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
