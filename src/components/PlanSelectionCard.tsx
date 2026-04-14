import { Check } from 'lucide-react';

type PlanSelectionCardProps = {
  name: string;
  price: string;
  originalPrice?: string | null;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  isSelected?: boolean;
  isCurrent?: boolean;
  isLoading?: boolean;
  ctaLabel?: string;
  onSelect: () => void;
};

export default function PlanSelectionCard({
  name,
  price,
  originalPrice,
  period,
  description,
  features,
  popular = false,
  isSelected = false,
  isCurrent = false,
  isLoading = false,
  ctaLabel = 'Get Started',
  onSelect,
}: PlanSelectionCardProps) {
  return (
    <article
      className={`relative rounded-2xl border p-8 transition-all ${
        isSelected
          ? 'border-[#2563EB] bg-white shadow-xl shadow-blue-100/60'
          : 'border-[#E5DED6] bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg'
      }`}
    >
      {(popular || isCurrent) && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[#1F2937] px-4 py-1 text-xs font-semibold text-white">
            {isCurrent ? 'CURRENT PLAN' : 'MOST POPULAR'}
          </span>
        </div>
      )}

      <div className="mb-6 min-h-[112px]">
        <h3 className="mb-3 text-2xl font-semibold text-[#1F2937]">{name}</h3>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[#1F2937]">{price}</span>
          {originalPrice && (
            <span className="text-lg text-[#9CA3AF] line-through">{originalPrice}</span>
          )}
          {period ? <span className="text-sm text-[#6B7280]">{period}</span> : null}
        </div>
        <p className="text-sm leading-6 text-[#6B7280]">{description}</p>
      </div>

      <button
        type="button"
        onClick={onSelect}
        disabled={isLoading}
        className={`mb-6 w-full rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
          isSelected || isCurrent
            ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
            : 'bg-[#F6F3EE] text-[#1F2937] hover:bg-[#EFE9E1]'
        } ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {isLoading ? 'Saving...' : ctaLabel}
      </button>

      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <span className="text-sm text-[#4B5563]">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
