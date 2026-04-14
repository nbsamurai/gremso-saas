import { Link } from 'react-router-dom';
import { Hammer, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Hammer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                ZENTIVORA TECHNOLOGIES
              </span>
            </div>
            <p className="text-base text-gray-500 mb-8 max-w-sm leading-relaxed">
              The modern workspace for construction teams to organize documents, manage projects, and collaborate.
            </p>
            <div className="flex space-x-5">
              <a
                href="https://www.instagram.com/ravi_rana1100/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Instagram profile"
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ravi-rana-88bb693b6/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn profile"
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-6">
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/features"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/blog"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-6">
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/terms"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-base text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-1 mb-4">
            <p className="text-sm text-gray-500 text-center font-medium">
              ZENTIVORA TECHNOLOGIES LTD - Company Number: 17049974
            </p>
            <p className="text-sm text-gray-500 text-center">
              Incorporated on 24 February 2026
            </p>
            <p className="text-sm text-gray-500 text-center">
              28, City Road, London, EC1V 2NX, United Kingdom
            </p>
          </div>
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} ZENTIVORA TECHNOLOGIES LTD. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
