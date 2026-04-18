import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import {
  FEATURES_INTRO,
  FEATURES_TAGLINE,
  HOME_MARKETING_FEATURES,
} from '../constants/featuresMarketing';
import PricingCard from '../components/PricingCard';
import Workflow from '../components/Workflow';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import dashboardImg from '../assets/dashboard.png';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isYearly, setIsYearly] = useState(false);

  const inviteToken = searchParams.get('inviteToken');
  const inviteAction = searchParams.get('inviteAction');

  useEffect(() => {
    if (inviteToken) {
      const destination = inviteAction === 'signup' ? '/signup' : '/login';
      navigate(`${destination}?inviteToken=${encodeURIComponent(inviteToken)}`, { replace: true });
    }
  }, [inviteAction, inviteToken, navigate]);

  const pricingPlans = [
    {
      name: 'Starter',
      price: isYearly ? '€470' : '€49',
      originalPrice: isYearly ? '€588' : undefined,
      period: isYearly ? '/year' : '/month',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 team members',
        'Projects, tasks, and documents',
        '10GB storage',
        'Basic features only',
      ],
    },
    {
      name: 'Professional',
      price: isYearly ? '€960' : '€100',
      originalPrice: isYearly ? '€1200' : undefined,
      period: isYearly ? '/year' : '/month',
      description: 'For growing teams with advanced needs',
      features: [
        'Up to 20 team members',
        '100GB storage',
        'Meetings and private notes',
        'Advanced features enabled',
      ],
      popular: true,
    },
    {
      name: 'Premium Plus',
      price: isYearly ? '€1910' : '€199',
      originalPrice: isYearly ? '€2388' : undefined,
      period: isYearly ? '/year' : '/month',
      description: 'For larger organizations that need unlimited scale',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'All features enabled',
        'Custom integrations',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1F2937] mb-6 tracking-tight">
            Scaffolding Management
            <br />
            <span className="text-gremso">Made Simple</span>
          </h1>
          <p className="text-xl text-[#6B7280] mb-10 max-w-3xl mx-auto leading-relaxed">
            The modern platform for construction teams to manage scaffolding
            projects, ensure safety compliance, and collaborate seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gremso rounded-lg hover:bg-gremso-dark shadow-sm transition-colors group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gremso-dark bg-gremso-soft rounded-lg hover:bg-cyan-100 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#1F2937]">
            Powerful Dashboard for Project Management
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-gray-600">
            Get a complete overview of your projects, team performance,
            documents, and progress in one place. Our intuitive dashboard helps
            you stay organized and make better decisions faster.
          </p>

          <div className="flex justify-center">
            <img
              src={dashboardImg}
              alt="Dashboard Preview"
              className="w-full max-w-5xl rounded-xl shadow-lg transition duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <div className="pb-8 sm:pb-12">
        <Workflow />
      </div>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
              {FEATURES_TAGLINE}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
              {FEATURES_INTRO}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOME_MARKETING_FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/features"
              className="inline-flex items-center text-sm font-semibold text-gremso-dark transition-colors hover:text-gremso"
            >
              Explore all features
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto mb-8">
              Choose the plan that works best for your team. All plans include
              a 14-day free trial.
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!isYearly ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>Monthly</span>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gremso transition-colors duration-200 ease-in-out focus:outline-none"
                role="switch"
                aria-checked={isYearly}
                onClick={() => setIsYearly(!isYearly)}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isYearly ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isYearly ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>Yearly</span>
                <span className="inline-flex items-center rounded-full bg-[#EFE9E1] px-2 py-0.5 text-xs font-medium text-[#1F2937] ring-1 ring-[#E5DED6]">
                  Save 20%
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      <Newsletter />

      <Footer />
    </div>
  );
}
