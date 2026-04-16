import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Cookie, Info, Settings, Globe } from 'lucide-react';

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-[#6B7280] leading-relaxed">
      {children}
    </div>
  );
}

export default function Cookies() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#1F2937] mb-6">
            Cookie Policy
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
              <Cookie className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">What they are</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Info className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Types we use</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Settings className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Your choices</h3>
            </div>
            <div className="bg-white rounded-xl border border-[#E5DED6] p-6 text-center">
              <Globe className="w-8 h-8 text-[#1F2937] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1F2937]">Third parties</h3>
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
                This Cookie Policy explains how we use cookies and similar
                technologies when you visit or use our website and SaaS
                platform.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                This website and service are owned and operated by{' '}
                <strong>Babu Lal Gurjar</strong>.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                By using Gremso, you agree to the use of cookies as described in
                this policy.
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
                2. What Are Cookies
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Cookies are small text files stored on your device (computer,
                mobile, or tablet) when you visit a website.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">They help websites:</p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Function properly</li>
                <li>Improve user experience</li>
                <li>Analyze performance</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                3. Types of Cookies We Use
              </h2>

              <h3 className="text-lg font-semibold text-[#1F2937] mt-2 mb-2">
                a. Essential Cookies
              </h3>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                These cookies are necessary for the website to function properly.
                They include:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-2">
                <li>Login/authentication cookies</li>
                <li>Security-related cookies</li>
                <li>Session management</li>
              </ul>
              <Callout>
                <strong className="text-[#1F2937]">Note:</strong> Without these
                cookies, the platform may not work correctly.
              </Callout>

              <h3 className="text-lg font-semibold text-[#1F2937] mt-8 mb-2">
                b. Performance &amp; Analytics Cookies
              </h3>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                These cookies help us understand how users interact with our
                website. They collect information such as:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-2">
                <li>Pages visited</li>
                <li>Time spent on site</li>
                <li>Errors encountered</li>
              </ul>
              <p className="text-[#6B7280] leading-relaxed">
                This helps us improve our services.
              </p>

              <h3 className="text-lg font-semibold text-[#1F2937] mt-8 mb-2">
                c. Functional Cookies
              </h3>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                These cookies remember your preferences, such as:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Language settings</li>
                <li>Login details</li>
                <li>User preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#1F2937] mt-8 mb-2">
                d. Third-Party Cookies
              </h3>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                We may use third-party services (such as analytics tools or
                payment providers like Creem) that place cookies on your device.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                These third parties have their own privacy and cookie policies.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                4. How We Use Cookies
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-2">We use cookies to:</p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2">
                <li>Ensure the platform works correctly</li>
                <li>Improve performance and usability</li>
                <li>Analyze user behavior</li>
                <li>Enhance security</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                5. Managing Cookies
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                You can control or disable cookies through your browser settings.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-2">
                Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-2 mb-2">
                <li>Block cookies</li>
                <li>Delete stored cookies</li>
                <li>Set preferences for certain websites</li>
              </ul>
              <Callout>
                <strong className="text-[#1F2937]">Note:</strong> Disabling
                cookies may affect the functionality of Gremso.
              </Callout>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">6. Consent</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                By continuing to use our website, you consent to our use of
                cookies as described in this policy.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                If required by applicable laws, we may display a cookie consent
                banner.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                7. Changes to This Policy
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                We may update this Cookie Policy from time to time.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Changes will be posted on this page with an updated &quot;Last
                Updated&quot; date.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5DED6] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">8. Contact Us</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                If you have any questions about this Cookie Policy:
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
