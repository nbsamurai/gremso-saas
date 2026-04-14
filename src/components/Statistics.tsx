import { Users, Building2, Server, Headphones } from 'lucide-react';

const stats = [
  {
    id: 1,
    name: 'Active Users',
    value: '10,000+',
    icon: Users,
  },
  {
    id: 2,
    name: 'Teams',
    value: '500+',
    icon: Building2,
  },
  {
    id: 3,
    name: 'Uptime',
    value: '99.9%',
    icon: Server,
  },
  {
    id: 4,
    name: 'Customer Support',
    value: '24/7',
    icon: Headphones,
  },
];

export default function Statistics() {
  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <stat.icon className="w-7 h-7 text-gray-800 group-hover:text-white transition-colors duration-300" />
              </div>
              <dd className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
                {stat.value}
              </dd>
              <dt className="text-base font-medium text-gray-500">
                {stat.name}
              </dt>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
