import { useState, useMemo, useEffect } from 'react';
import Card from './components/Card';
import Select from './components/Select';
import FilterCheckbox from './components/FilterCheckbox';
import RadarChart from './components/RadarChart';
import { equipementData, filiereColors } from './data/equipement';
import * as d3 from 'd3';
import { Info } from 'lucide-react';

type Filiere = 'comparaison' | 'vegetale' | 'animale';
type Echelle = 'lineaire' | 'racine_carree' | 'logarithmique';

const filiereOptions = [
  { value: 'comparaison', label: 'Comparaison par Filière' },
  { value: 'vegetale', label: 'Filière Végétale' },
  { value: 'animale', label: 'Filière Animale' }
];

const echelleOptions = [
  { value: 'lineaire', label: 'Linéaire' },
  { value: 'racine_carree', label: 'Racine carrée' },
  { value: 'logarithmique', label: 'Logarithmique' }
];

const titles: Record<Filiere, string> = {
  comparaison: 'Comparaison des filières agricoles',
  vegetale: 'Filière Végétale - Équipement par spécialisation',
  animale: 'Filière Animale - Équipement par spécialisation'
};

const subtitles: Record<Filiere, string> = {
  comparaison: "Taux moyens d'équipement numérique par type",
  vegetale: "Taux d'équipement numérique par spécialisation",
  animale: "Taux d'équipement numérique par spécialisation"
};

const echelleNotes: Record<Echelle, string> = {
  lineaire: '',
  racine_carree: '(échelle racine carrée - zoom sur petites valeurs)',
  logarithmique: '(échelle logarithmique - zoom maximal sur petites valeurs)'
};

export default function App() {
  const [filiere, setFiliere] = useState<Filiere>('comparaison');
  const [echelle, setEchelle] = useState<Echelle>('lineaire');
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(new Set());

  const specialisations = useMemo(() => {
    if (filiere === 'comparaison') return [];
    return [...new Set(
      equipementData
        .filter(d => d.filiere === filiere)
        .map(d => d.specialisation)
    )].sort();
  }, [filiere]);

  useEffect(() => {
    setSelectedSpecs(new Set(specialisations));
  }, [specialisations]);

  const getLegendItems = () => {
    if (filiere === 'comparaison') {
      return [
        { key: 'vegetale', label: 'Filière végétale', color: filiereColors.vegetale },
        { key: 'animale', label: 'Filière animale', color: filiereColors.animale }
      ];
    }
    const colors = d3.schemeTableau10;
    return [...selectedSpecs].sort().map((spec, i) => ({
      key: spec,
      label: spec,
      color: colors[i % colors.length]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Logo Agritech */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="AgriTech Logo" className="w-10 h-10" />
                <span className="text-xl font-semibold text-slate-800">AgriTech</span>
              </div>
            </div>

            <Card title="Paramètres">
              <div className="space-y-4">
                <Select
                  label="Vue"
                  value={filiere}
                  onChange={(v) => setFiliere(v as Filiere)}
                  options={filiereOptions}
                />
                <Select
                  label="Type d'échelle"
                  value={echelle}
                  onChange={(v) => setEchelle(v as Echelle)}
                  options={echelleOptions}
                />
              </div>
            </Card>

            {filiere !== 'comparaison' && (
              <Card title="Filtrer les spécialisations">
                <FilterCheckbox
                  items={specialisations}
                  selected={selectedSpecs}
                  onChange={setSelectedSpecs}
                  onSelectAll={() => setSelectedSpecs(new Set(specialisations))}
                  onSelectNone={() => setSelectedSpecs(new Set())}
                />
              </Card>
            )}

            <Card title="Données">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                  <p>Source : INSEE — Enquête sur l'utilisation des technologies numériques dans les exploitations agricoles, 2023.</p>
                  <a
                    href="https://www.insee.fr/fr/statistiques/8616847?sommaire=8616883"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium underline underline-offset-2 transition-colors"
                  >
                    Accéder aux données INSEE
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-4">
            <Card>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{titles[filiere]}</h2>
                <p className="text-slate-500 mt-1">{subtitles[filiere]}</p>
                {echelleNotes[echelle] && (
                  <p className="text-sm text-slate-400 italic mt-1">{echelleNotes[echelle]}</p>
                )}
              </div>

              {selectedSpecs.size === 0 && filiere !== 'comparaison' ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <p>Sélectionnez au moins une spécialisation pour afficher le graphique.</p>
                </div>
              ) : (
                <RadarChart
                  filiere={filiere}
                  echelle={echelle}
                  selectedSpecialisations={selectedSpecs}
                />
              )}
            </Card>

            {(filiere === 'comparaison' || selectedSpecs.size > 0) && (
              <Card title="Légende">
                <div className="flex flex-wrap gap-3">
                  {getLegendItems().map(item => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm"
                    >
                      <div
                        className="w-5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

      </main>

    </div>
  );
}
