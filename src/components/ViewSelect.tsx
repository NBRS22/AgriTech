import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Radar, Map, LayoutDashboard } from 'lucide-react';

export type ViewIconType = 'accueil' | 'radar' | 'carte';

export interface ViewOption {
  value: string;
  label: string;
  icon: ViewIconType;
}

interface ViewSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: ViewOption[];
}

function ViewIcon({ type, className }: { type: ViewIconType; className?: string }) {
  if (type === 'accueil') return <LayoutDashboard className={className} />;
  if (type === 'carte') return <Map className={className} />;
  return <Radar className={className} />;
}

export default function ViewSelect({ value, onChange, options }: ViewSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 pl-4 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-medium
                   cursor-pointer transition-all duration-200 text-left
                   hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
      >
        <ViewIcon type={selected.icon} className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span className="truncate">{selected.label}</span>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${
                opt.value === value
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-slate-50 text-slate-800'
              }`}
            >
              <ViewIcon type={opt.icon} className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
