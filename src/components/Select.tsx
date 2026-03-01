import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export default function Select({ label, value, onChange, options }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full pl-4 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-medium
                     cursor-pointer transition-all duration-200 text-left
                     hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        >
          <span className="block truncate">{selected.label}</span>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-transform pointer-events-none ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  opt.value === value
                    ? 'bg-green-50 text-green-700'
                    : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
