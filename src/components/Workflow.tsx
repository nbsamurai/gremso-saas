import { UserPlus, FolderPlus, ListTodo } from 'lucide-react';

const steps = [
  {
    id: 1,
    name: 'Create your workspace',
    description: 'Sign up and set up your digital environment in seconds.',
    icon: FolderPlus,
  },
  {
    id: 2,
    name: 'Invite your team',
    description: 'Add members, set permissions, and collaborate securely.',
    icon: UserPlus,
  },
  {
    id: 3,
    name: 'Manage tasks and projects',
    description: 'Start organizing your workflows and tracking progress.',
    icon: ListTodo,
  },
];

export default function Workflow() {
  return (
    <div className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Get your team up and running in three simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div
            className="hidden md:absolute md:block md:w-full md:h-0.5 md:bg-gray-200"
            style={{ top: '3rem', left: '0' }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="relative text-center">
                <div className="flex items-center justify-center w-24 h-24 mx-auto bg-white border-4 border-gray-50 rounded-full shadow-lg mb-8 relative z-10">
                  <step.icon className="w-10 h-10 text-gray-800" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 cursor-pointer hover:text-indigo-600 transition-colors">
                  {step.name}
                </h3>
                <p className="text-gray-500 leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
