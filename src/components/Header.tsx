import { BarChart3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">AgriTech</h1>
              <p className="text-xs text-slate-500">Équipement numérique agricole</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
              France 2023
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
