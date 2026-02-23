import { usageData } from '../data/equipement';
import { Monitor, Brain, Target, Bot } from 'lucide-react';

interface UsageChartsProps {
  filiere: 'vegetale' | 'animale';
}

const categoryConfig: Record<string, { icon: typeof Monitor; gradient: string }> = {
  "Logiciels spécialisés": { icon: Monitor, gradient: "from-green-500 to-green-400" },
  "Outils aide décision": { icon: Brain, gradient: "from-blue-500 to-blue-400" },
  "Matériels précision": { icon: Target, gradient: "from-orange-500 to-orange-400" },
  "Robots": { icon: Bot, gradient: "from-purple-500 to-purple-400" },
  "Robots automates": { icon: Bot, gradient: "from-purple-500 to-purple-400" }
};

export default function UsageCharts({ filiere }: UsageChartsProps) {
  const filteredData = usageData.filter(d => d.filiere === filiere);
  const categories = [...new Set(filteredData.map(d => d.categorie))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map(category => {
        const catData = filteredData
          .filter(d => d.categorie === category)
          .sort((a, b) => b.part - a.part);
        
        const config = categoryConfig[category] || categoryConfig["Logiciels spécialisés"];
        const Icon = config.icon;

        return (
          <div key={category} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h3 className="flex items-center gap-3 font-semibold text-slate-800 mb-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              {category}
            </h3>
            
            <div className="space-y-3">
              {catData.map(item => (
                <div key={item.usage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.usage}</span>
                    <span className="font-semibold text-slate-800">{item.part}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-700 ease-out`}
                      style={{ width: `${item.part}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
