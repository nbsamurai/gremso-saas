import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, RefreshCw, FileCheck, HelpCircle } from 'lucide-react';

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-[#6B7280] leading-relaxed">
      {children}
    </div>
  );
}

export default function Refund() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#1F2937] mb-6">
            Refund &amp; Cancellation Policy
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
              <CreditCard className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Subscriptions</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <RefreshCw className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Cancellation</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <FileCheck className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Refunds</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <HelpCircle className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Support</h3>
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
                This Refund &amp; Cancellation Policy outlines the terms under
                which payments, subscriptions, and cancellations are handled
                for our SaaS platform.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                This website and service are owned and operated by{' '}
                <strong>Babu Lal Gurjar</strong>.
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
                2. Subscription Policy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Gremso operates on a subscription-based billing model.
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>
                  Users are billed on a recurring basis (monthly / yearly
                  depending on plan)
                </li>
                <li>By subscribing, you authorize automatic recurring payments</li>
                <li>Subscription fees are charged in advance</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                3. Cancellation Policy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                You may cancel your subscription at any time.
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Cancellation will stop future billing</li>
                <li>
                  You will continue to have access to the service until the end
                  of your current billing cycle
                </li>
                <li>No partial refunds will be provided for unused time</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                4. Refund Policy
              </h2>

              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                a. General Policy
              </h3>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                All payments are non-refundable
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We do not provide refunds for:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-6">
                <li>Change of mind</li>
                <li>Partial usage</li>
                <li>Unused subscription period</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                b. Exceptions (Eligible Refunds)
              </h3>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                Refunds may be considered only in the following cases:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-2">
                <li>Duplicate or accidental payments</li>
                <li>
                  Technical issues caused by our platform that prevent service
                  usage
                </li>
                <li>Billing errors</li>
              </ul>
              <Callout>
                Refund requests must be made within{' '}
                <strong className="text-[#1F2937]">7 days</strong> of the
                transaction.
              </Callout>

              <h3 className="text-lg font-semibold text-[#1F2937] mt-8 mb-2">
                c. Refund Process
              </h3>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-2">
                <li>
                  To request a refund, contact:{' '}
                  <a
                    href="mailto:support@gremso.com"
                    className="font-semibold text-[#1F2937] underline underline-offset-2 hover:no-underline"
                  >
                    support@gremso.com
                  </a>
                </li>
                <li>Provide:</li>
              </ul>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 ml-4 sm:ml-8 mb-4">
                <li>Registered email</li>
                <li>Payment details</li>
                <li>Reason for request</li>
              </ul>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>
                  Approved refunds will be processed within{' '}
                  <strong>7–10 business days</strong>
                </li>
                <li>Refunds will be issued to the original payment method</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                5. Free Trials (if applicable)
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                If a free trial is offered:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>No charges will apply during the trial period</li>
                <li>
                  After the trial ends, your subscription will automatically
                  begin unless canceled before the trial expires
                </li>
                <li>No refunds will be issued after conversion to a paid plan</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                6. Failed Payments
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                If a payment fails:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Your access may be temporarily suspended</li>
                <li>We may retry billing automatically</li>
                <li>Continued failure may result in account termination</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                7. Chargebacks &amp; Disputes
              </h2>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-4">
                <li>
                  Users are encouraged to contact us before initiating a
                  chargeback
                </li>
                <li>Unauthorized chargebacks may result in:</li>
              </ul>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 ml-4 sm:ml-8">
                <li>Immediate account suspension</li>
                <li>Permanent ban from the platform</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We reserve the right to update this Refund &amp; Cancellation
                Policy at any time.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Changes will be posted on this page with an updated date.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                9. Contact Us
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                For any billing, refund, or cancellation queries:
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
