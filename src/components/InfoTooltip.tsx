import { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export default function InfoTooltip({ content, className = '' }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-green-100 text-green-600 cursor-help transition-colors hover:bg-green-200"
        aria-describedby="info-tooltip"
      >
        <Info className="w-4 h-4" />
      </span>
      {visible && (
        <div
          id="info-tooltip"
          role="tooltip"
          className="absolute z-50 right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] p-3 text-sm text-slate-600 bg-white rounded-xl shadow-lg border border-slate-100 animate-popover-in"
        >
          {content}
        </div>
      )}
    </div>
  );
}
