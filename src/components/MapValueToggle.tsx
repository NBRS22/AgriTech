interface MapValueToggleProps {
  value: 'count' | 'percent';
  onChange: (value: 'count' | 'percent') => void;
  label: string;
  countLabel: string;
  percentLabel: string;
}

export default function MapValueToggle({ value, onChange, label, countLabel, percentLabel }: MapValueToggleProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div
        role="group"
        aria-label={label}
        className="inline-flex w-full rounded-xl bg-slate-100 p-1 gap-0.5"
      >
        <button
          type="button"
          onClick={() => onChange('count')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            value === 'count'
              ? 'bg-white text-green-700 shadow-sm ring-1 ring-slate-200/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
          }`}
        >
          {countLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange('percent')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            value === 'percent'
              ? 'bg-white text-green-700 shadow-sm ring-1 ring-slate-200/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
          }`}
        >
          {percentLabel}
        </button>
      </div>
    </div>
  );
}
