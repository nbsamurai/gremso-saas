import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function PricingCard({
  name,
  price,
  originalPrice,
  period,
  description,
  features,
  popular = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative p-8 bg-white rounded-xl border-2 transition-all ${
        popular
          ? 'border-indigo-600 shadow-xl'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
            POPULAR
          </span>
        </div>
      )}
      <div className="mb-6 h-[88px]">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-4xl font-bold text-gray-800">{price}</span>
          {originalPrice && (
            <span className="text-xl text-gray-400 line-through ml-2">{originalPrice}</span>
          )}
          {price !== 'Custom' && (
            <span className="text-gray-500 ml-2">{period || '/month'}</span>
          )}
        </div>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <Link
        to="/pricing"
        className={`block w-full rounded-lg px-6 py-3 text-center font-medium transition-colors mb-6 ${
          popular
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Get Started
      </Link>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-500">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
