import { Link } from 'react-router-dom';

type UpgradePromptProps = {
  title?: string;
  message?: string;
  compact?: boolean;
  showButton?: boolean;
};

export default function UpgradePrompt({
  title = 'Upgrade your plan to continue',
  message = 'Your current plan has reached a limit or does not include this feature yet.',
  compact = false,
  showButton = true,
}: UpgradePromptProps) {
  return (
    <div className={`rounded-xl border border-[#D7C7B3] bg-[#FFF7ED] ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#1F2937]">{title}</h3>
          <p className="mt-1 text-sm text-[#6B7280]">{message}</p>
        </div>
        {showButton ? (
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
          >
            Upgrade Plan
          </Link>
        ) : null}
      </div>
    </div>
  );
}
