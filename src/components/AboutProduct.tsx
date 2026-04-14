import {
  FileText,
  CheckSquare,
  Users,
  Cloud,
  RefreshCw,
  Shield,
  Target,
  Briefcase,
  Code,
  Building
} from 'lucide-react';

const features = [
  {
    name: 'Document Management',
    description: 'Organize and manage all your important documents in one secure place.',
    icon: FileText,
  },
  {
    name: 'Task & Project Tracking',
    description: 'Keep track of every task, milestone, and project deadline effortlessly.',
    icon: CheckSquare,
  },
  {
    name: 'Team Collaboration',
    description: 'Work together seamlessly with your team, no matter where they are.',
    icon: Users,
  },
  {
    name: 'Cloud Workspace',
    description: 'Access your entire workspace from anywhere, on any device.',
    icon: Cloud,
  },
  {
    name: 'Real-time Updates',
    description: 'See changes as they happen and stay perfectly in sync with your team.',
    icon: RefreshCw,
  },
  {
    name: 'Secure Data Storage',
    description: 'Rest easy knowing your data is protected with enterprise-grade security.',
    icon: Shield,
  },
];

const steps = [
  { id: 1, title: 'Create a workspace', description: 'Set up your dedicated digital environment in seconds.' },
  { id: 2, title: 'Invite team members', description: 'Bring your team on board with simple email invitations.' },
  { id: 3, title: 'Create documents and project boards', description: 'Start organizing your knowledge and tracking work.' },
  { id: 4, title: 'Assign tasks and track progress', description: 'Delegate responsibilities and monitor project health.' },
  { id: 5, title: 'Collaborate and manage work in real time', description: 'Experience seamless teamwork and fluid communication.' },
];

const useCases = [
  { title: 'Startups', icon: SpaceIcon, description: 'Scale your fast-growing team with an agile workspace.' },
  { title: 'Project teams', icon: Briefcase, description: 'Keep complex projects organized and perfectly on track.' },
  { title: 'Developers', icon: Code, description: 'Manage sprints, documentation, and technical specs.' },
  { title: 'Businesses', icon: Building, description: 'Centralize internal documentation and knowledge bases.' },
];

// Helper icon for Startups
function SpaceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function AboutProduct() {
  return (
    <div className="bg-white">
      {/* Product Overview & Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About the Platform</h2>
          <div className="prose prose-lg prose-gray mx-auto text-gray-500 space-y-6">
            <p>
              <strong>Gremso</strong> is a <strong>cloud-based SaaS productivity and collaboration platform</strong> inspired by the simplicity and power of modern digital workspaces.
            </p>
            <p>
              It serves as a central hub where teams can organize documents, manage complex projects, track individual tasks, and collaborate effortlessly in one place.
            </p>
            <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                The Problem It Solves
              </h3>
              <p className="text-gray-500">
                Many modern companies struggle with fragmented workflows, using scattered tools for taking notes, managing projects, and housing documentation. This platform combines everything into one simple, beautifully organized workspace, eliminating tool fatigue and keeping your team perfectly aligned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-500">A simple, intuitive workflow to get your team moving faster.</p>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-8 h-full w-0.5 bg-gray-200 hidden md:block" aria-hidden="true" />
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.id} className="relative flex items-start group">
                  <div className="h-16 w-16 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 z-10 md:ml-0 shadow-sm group-hover:border-indigo-600 transition-colors duration-200">
                    <span className="text-xl font-bold text-gray-800">{step.id}</span>
                  </div>
                  <div className="ml-6 pt-3">
                    <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                    <p className="mt-2 text-gray-500 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
            <p className="text-xl text-gray-500">Everything you need to manage work effectively.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.name}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Who Can Use This Space?</h2>
            <p className="text-xl text-gray-400">Built for teams of all shapes and sizes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
                <useCase.icon className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Choose This Platform?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 text-left">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">✓</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">All tools in one place</h4>
                <p className="text-gray-500 rounded">Eliminate the need to jump between multiple disjointed apps.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">✓</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Better productivity</h4>
                <p className="text-gray-500">Streamlined workflows mean faster execution and less friction.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">✓</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Organized workflows</h4>
                <p className="text-gray-500">Customizable boards and docs adapt naturally to how you work.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">✓</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Easy collaboration</h4>
                <p className="text-gray-500">Built-in commenting, assigning, and real-time multiplayer editing.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">✓</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Accessible anywhere</h4>
                <p className="text-gray-500">Fully cloud-native, ensuring your workspace is always within reach.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
