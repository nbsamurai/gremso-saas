import { Link } from 'react-router-dom';
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
            About Gremso
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Gremso is an independent SaaS product on a mission to help
            construction teams manage scaffolding projects with clearer
            workflows, safer operations, and less friction.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1">
            <div className="max-w-4xl mx-auto w-full text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our story
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  <strong>Gremso</strong> is built and operated by{' '}
                  <strong>Babu Lal Gurjar</strong>. It started from a simple
                  observation: construction teams were juggling scattered tools
                  to run complex scaffolding work—documents, deadlines, and
                  coordination were harder than they needed to be.
                </p>
                <p>
                  Rather than layering another generic app on top of that mess,
                  the focus became a single workspace: project management,
                  document handling, and team visibility in one place, with
                  safety and compliance in mind from day one.
                </p>
                <p>
                  Because the product is individually led, decisions stay close
                  to the people who use it: ship useful features, listen to
                  feedback, and keep quality high. Teams use <strong>Gremso</strong>{' '}
                  to run scaffolding operations with clearer accountability and
                  a smoother day-to-day rhythm.
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
                Our mission
              </h3>
              <p className="text-gray-500 leading-relaxed">
                To give construction teams a scaffolding-focused workspace that
                feels powerful yet simple—so they can spend less time fighting
                software and more time delivering safe, efficient projects.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our vision
              </h3>
              <p className="text-gray-500 leading-relaxed">
                A future where field and office teams share one trusted home for
                projects and documents—where <strong>Gremso</strong> keeps
                improving through direct feedback and steady, thoughtful
                iteration from an independent builder.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutProduct />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why choose Gremso?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Built for teams
              </h3>
              <p className="text-gray-500 text-sm">
                Collaboration, roles, and shared context—not solo spreadsheets.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Owner-led quality
              </h3>
              <p className="text-gray-500 text-sm">
                Shaped by Babu Lal Gurjar with a direct line from users to the
                product roadmap.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Safety in mind
              </h3>
              <p className="text-gray-500 text-sm">
                Compliance and operational visibility for demanding job sites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join our community
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Become part of a growing group of construction professionals using{' '}
            <strong className="text-white">Gremso</strong> to run their projects.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-800 bg-white rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get started today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
