import { useState, useMemo, useEffect } from 'react';
import Card from './components/Card';
import Select from './components/Select';
import RadarChart from './components/RadarChart';
import MapChart from './components/MapChart';
import { equipementData, filiereColors } from './data/equipement';
import * as d3 from 'd3';
import { Info } from 'lucide-react';

type Filiere = 'comparaison' | 'vegetale' | 'animale' | 'carte';
type Echelle = 'lineaire' | 'racine_carree' | 'logarithmique';

const outilOptions = [
  { value: 'Robot affouragement',           label: 'Robot affouragement' },
  { value: 'Distributeur automatique', label: 'Distributeur automatique' },
  { value: 'Systeme nettoyage automatise',   label: 'Système nettoyage automatisé' },
  { value: 'Paillage automatise',            label: 'Paillage automatisé' },
  { value: 'Robot de traite',                label: 'Robot de traite' },
];

const filiereOptions = [
  { value: 'comparaison', label: 'Comparaison par filière' },
  { value: 'vegetale', label: 'Filière Végétale' },
  { value: 'animale', label: 'Filière Animale' },
  { value: 'carte', label: 'Robotique pour l’élevage' },
];

const echelleOptions = [
  { value: 'lineaire', label: 'Linéaire' },
  { value: 'racine_carree', label: 'Racine carrée' },
  { value: 'logarithmique', label: 'Logarithmique' }
];

const titles: Record<string, string> = {
  comparaison: 'Comparaison des filières agricoles',
  vegetale: 'Filière Végétale - Équipement par spécialisation',
  animale: 'Filière Animale - Équipement par spécialisation',
};

const subtitles: Record<string, string> = {
  comparaison: "Taux moyens d'équipement numérique par type",
  vegetale: "Taux d'équipement numérique par spécialisation",
  animale: "Taux d'équipement numérique par spécialisation",
};

const echelleNotes: Record<Echelle, string> = {
  lineaire: '',
  racine_carree: '(échelle racine carrée - zoom sur petites valeurs)',
  logarithmique: '(échelle logarithmique - zoom maximal sur petites valeurs)'
};

export default function App() {
  const [outilSelectionne, setOutilSelectionne] = useState('Distributeur automatique');
  const [filiere, setFiliere] = useState<Filiere>('comparaison');
  const [echelle, setEchelle] = useState<Echelle>('lineaire');
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(new Set());
  const [selectedFilieres, setSelectedFilieres] = useState<Set<string>>(new Set(['vegetale', 'animale']));

  const specialisations = useMemo(() => {
    if (filiere === 'comparaison' || filiere === 'carte') return [];
    return [...new Set(
      equipementData
        .filter(d => d.filiere === filiere)
        .map(d => d.specialisation)
    )].sort();
  }, [filiere]);

  useEffect(() => {
    setSelectedSpecs(new Set(specialisations));
  }, [specialisations]);

  useEffect(() => {
    setSelectedFilieres(new Set(['vegetale', 'animale']));
  }, [filiere]);

  const toggleSpec = (spec: string) => {
    const next = new Set(selectedSpecs);
    if (next.has(spec)) next.delete(spec);
    else next.add(spec);
    setSelectedSpecs(next);
  };

  const toggleFiliere = (key: string) => {
    const next = new Set(selectedFilieres);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedFilieres(next);
  };

  const getLegendItems = () => {
    if (filiere === 'comparaison') {
      return [
        { key: 'vegetale', label: 'Filière végétale', color: filiereColors.vegetale, active: selectedFilieres.has('vegetale') },
        { key: 'animale', label: 'Filière animale', color: filiereColors.animale, active: selectedFilieres.has('animale') }
      ];
    }
    const colors = d3.schemeTableau10;
    return specialisations.map((spec, i) => ({
      key: spec,
      label: spec,
      color: colors[i % colors.length],
      active: selectedSpecs.has(spec)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex flex-col items-center gap-2">
                <span
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  AgriTech
                </span>
                <div className="w-8 h-px bg-slate-200 rounded-full" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[11px] font-medium text-slate-500">Nour EL Bachari</span>
                  <span className="text-[11px] font-medium text-slate-500">Asmae HMIDANI</span>
                </div>
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
                {filiere === 'carte' ? (
                  <Select
                    label="Type d'équipement"
                    value={outilSelectionne}
                    onChange={(v) => setOutilSelectionne(v)}
                    options={outilOptions}
                  />
                ) : (
                  <Select
                    label="Type d'échelle"
                    value={echelle}
                    onChange={(v) => setEchelle(v as Echelle)}
                    options={echelleOptions}
                  />
                )}
              </div>
            </Card>

            <Card title="Données">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                {filiere === 'carte' ? (
                  <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                    <p>Source : Agreste — Enquête sur la structure des exploitations agricoles (ESEA), 2023.</p>
                    <a
                      href="https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium underline underline-offset-2 transition-colors"
                    >
                      Accéder aux données ESEA 2023
                    </a>
                  </div>
                ) : (
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
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-4">
            {filiere === 'carte' ? (
              <Card>
                <MapChart outilSelectionne={outilSelectionne} />
              </Card>
            ) : (
              <>
            <Card>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{titles[filiere]}</h2>
                <p className="text-slate-500 mt-1">{subtitles[filiere]}</p>
                {echelleNotes[echelle] && (
                  <p className="text-sm text-slate-400 italic mt-1">{echelleNotes[echelle]}</p>
                )}
              </div>

              {(selectedSpecs.size === 0 && filiere !== 'comparaison') || (selectedFilieres.size === 0 && filiere === 'comparaison') ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <p>Sélectionnez au moins un élément dans la légende pour afficher le graphique.</p>
                </div>
              ) : (
              <RadarChart
                  filiere={filiere}
                  echelle={echelle}
                  selectedSpecialisations={selectedSpecs}
                  allSpecialisations={specialisations}
                  selectedFilieres={selectedFilieres}
                />
              )}
            </Card>

            {(filiere === 'comparaison' || specialisations.length > 0) && filiere !== 'carte' && (
              <Card
                title="Légende et filtre"
                actions={
                  <>
                    <button
                      onClick={() => {
                        if (filiere === 'comparaison') setSelectedFilieres(new Set(['vegetale', 'animale']));
                        else setSelectedSpecs(new Set(specialisations));
                      }}
                      className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
                    >✓ Tout</button>
                    <button
                      onClick={() => {
                        if (filiere === 'comparaison') setSelectedFilieres(new Set());
                        else setSelectedSpecs(new Set());
                      }}
                      className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                    >✗ Aucun</button>
                  </>
                }
              >
                <div className="flex flex-wrap gap-2">
                  {getLegendItems().map(item => (
                    <button
                      key={item.key}
                      onClick={() => filiere === 'comparaison' ? toggleFiliere(item.key) : toggleSpec(item.key)}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-all duration-200 cursor-pointer hover:border-slate-400 ${
                        item.active
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-white border-slate-100 text-slate-300 opacity-50'
                      }`}
                    >
                      <div
                        className="w-5 h-1.5 rounded-full transition-opacity"
                        style={{ backgroundColor: item.color, opacity: item.active ? 1 : 0.3 }}
                      />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}
              </>
            )}
          </div>
        </div>

      </main>

    </div>
  );
}
