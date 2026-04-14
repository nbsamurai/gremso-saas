import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Eye, Award, Users } from 'lucide-react';
import AboutProduct from '../components/AboutProduct';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            About ZENTIVORA TECHNOLOGIES
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            We're on a mission to revolutionize how construction teams manage
            scaffolding projects through innovative technology and seamless
            collaboration.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1">
            <div className="max-w-4xl mx-auto w-full text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  ZENTIVORA TECHNOLOGIES LTD - Company Number: 17049974
                  <br />
                  Incorporated on 24 February 2026.
                  <br />
                  <br />
                  We emerged from a simple observation: construction teams were
                  struggling with outdated tools to manage complex scaffolding
                  projects.
                </p>
                <p>
                  We knew there had to be a better way. So we built a platform
                  that combines powerful project management features with safety
                  compliance tools, all wrapped in a beautiful, easy-to-use
                  interface.
                </p>
                <p>
                  Today, teams across the globe trust ZENTIVORA to manage their
                  scaffolding operations, ensuring safety, efficiency, and
                  seamless collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-500 leading-relaxed">
                To empower construction teams with the best scaffolding
                management platform, making projects safer, more efficient, and
                easier to manage. We believe that great software should be
                powerful yet simple, helping teams focus on what matters most.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-500 leading-relaxed">
                To become the global standard for scaffolding project
                management, setting new benchmarks for safety, efficiency, and
                team collaboration in the construction industry. We envision a
                world where every project runs smoothly and safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutProduct />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why Choose ZENTIVORA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Built for Teams
              </h3>
              <p className="text-gray-500 text-sm">
                Designed from the ground up with team collaboration at its core
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Industry Leading
              </h3>
              <p className="text-gray-500 text-sm">
                Trusted by top construction companies worldwide
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Focused on Safety
              </h3>
              <p className="text-gray-500 text-sm">
                Comprehensive safety compliance features built in
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Become part of a growing community of construction professionals
            using ZENTIVORA to transform their projects.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-800 bg-white rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
