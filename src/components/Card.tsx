import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, actions, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-4 bg-green-500 rounded-full"></span>
            {title}
          </h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
