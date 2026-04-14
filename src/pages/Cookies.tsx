import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Settings, Cookie, Info, Globe } from 'lucide-react';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Cookie Policy
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
              <Cookie className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Definition</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Info className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Purpose</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Settings className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Management</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Globe className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Third-Party</h3>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                What Are Cookies
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Cookies are small pieces of text sent to your web browser by a
                website you visit. They are stored in your web browser and allow
                ZENTIVORA TECHNOLOGIES LTD or a third party to recognize you and
                make your next visit easier and our services more useful to you.
              </p>
              <p className="text-gray-500 leading-relaxed">
                By using our platform, you consent to the use of cookies in
                accordance with this policy.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                How We Use Cookies
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We utilize cookies across our SaaS platform to facilitate core
                functionalities, authenticate users, prevent fraudulent use of
                login credentials, and protect user data from unauthorized
                access.
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2 mb-4">
                <li>
                  Essential cookies: Required for the operation of our platform.
                  They include authentication cookies.
                </li>
                <li>
                  Analytical cookies: Allow us to recognize and count the number
                  of visitors and see how visitors move around our workspace.
                </li>
                <li>
                  Functionality cookies: Used to recognize you when you return
                  to our website, enabling personalization (e.g., remembering
                  your language).
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Types of Cookies
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                When you use and access ZENTIVORA TECHNOLOGIES LTD, we may place
                a number of cookie files in your web browser.
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2">
                <li>
                  <strong>Session Cookies:</strong> Temporary cookies that
                  remain in the cookie file of your browser until you leave the
                  site. They are essential for navigating our secure dashboards.
                </li>
                <li>
                  <strong>Persistent Cookies:</strong> These remain in the
                  cookie file of your browser for much longer (how long will
                  depend on the lifetime of the specific cookie). We use them to
                  remember your login status and interface preferences.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Managing Preferences
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                If you'd like to delete cookies or instruct your web browser to
                delete or refuse cookies, please visit the help pages of your
                web browser.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Please note, however, that if you delete cookies or refuse to
                accept them, you might not be able to use all of the features we
                offer, you may not be able to store your preferences, and some
                of our pages might not display properly.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                If you have any questions about our use of cookies, please
                contact us at:
              </p>
              <ul className="text-gray-500 space-y-2">
                <li>Email: privacy@zentivora.com</li>
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
