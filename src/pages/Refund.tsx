import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, RefreshCw, HelpCircle, FileCheck } from 'lucide-react';

export default function Refund() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Refund Policy
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
              <RefreshCw className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Processing</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <FileCheck className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Eligibility</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <CreditCard className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Payments</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <HelpCircle className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Support</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Overview
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                At ZENTIVORA TECHNOLOGIES LTD, we strive to ensure absolute
                satisfaction with our productivity workspace. However, we
                understand that sometimes a service might not be the perfect fit
                for your operational needs.
              </p>
              <p className="text-gray-500 leading-relaxed">
                This document outlines the conditions under which refunds are
                issued to our customers.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Subscription Cancellations
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                You may cancel your subscription at any time. When you cancel,
                you will continue to have access to the platform until the end
                of your current billing cycle.
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2 mb-4">
                <li>
                  Monthly subscriptions: Cancellation takes effect at the end of
                  the current paid month.
                </li>
                <li>
                  Annual subscriptions: Cancellation takes effect at the end of
                  the current paid year.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Refund Eligibility
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We offer a 14-day money-back guarantee for all new annual
                subscriptions. If you are not satisfied within the first 14
                days of your initial purchase, you are eligible for a full
                refund.
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2">
                <li>
                  Monthly subscriptions are generally non-refundable unless
                  legally required.
                </li>
                <li>
                  Renewals (auto-charges) are non-refundable. We send reminder
                  emails before annual renewals occur.
                </li>
                <li>
                  Refunds are not granted for accounts terminated due to a
                  violation of our Terms & Conditions.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Processing Times
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Once a refund is approved by our billing team, it typically
                takes 5-10 business days for the funds to reflect on your
                original payment method.
              </p>
              <p className="text-gray-500 leading-relaxed">
                If the refund has not appeared after 14 days, please contact
                your banking institution before reaching back out to us.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Requesting a Refund
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                To initiate a refund request under the eligible terms above,
                please reach out to our team:
              </p>
              <ul className="text-gray-500 space-y-2">
                <li>Email: billing@zentivora.com</li>
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
