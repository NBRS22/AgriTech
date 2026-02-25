import { useState, useMemo, useEffect } from 'react';
import Card from './components/Card';
import Select from './components/Select';
import ViewSelect from './components/ViewSelect';
import IconSelect from './components/IconSelect';
import RadarChart from './components/RadarChart';
import MapChart from './components/MapChart';
import AccueilPage from './components/AccueilPage';
import { equipementData, filiereColors } from './data/equipement';
import * as d3 from 'd3';
import { Info, ChevronLeft, ChevronRight, Minus, SquareRadical, Search } from 'lucide-react';

type Filiere = 'accueil' | 'comparaison' | 'vegetale' | 'animale' | 'carte' | 'carte_vegetale' | 'carte_precision' | 'carte_aide_decision' | 'carte_logiciels';
type Echelle = 'lineaire' | 'racine_carree' | 'logarithmique';

const outilOptionsAnimal = [
  { value: 'Robot affouragement', label: 'Robot affouragement' },
  { value: 'Distributeur automatique', label: 'Distributeur automatique' },
  { value: 'Systeme nettoyage automatise', label: 'Système nettoyage automatisé' },
  { value: 'Paillage automatise', label: 'Paillage automatisé' },
  { value: 'Robot de traite', label: 'Robot de traite' },
];

const outilOptionsVegetale = [
  { value: 'Robot de désherbage mécanique', label: 'Robot de désherbage mécanique' },
  { value: 'Robot de pulvérisation et épandage', label: 'Robot de pulvérisation et épandage' },
  { value: 'Robot de travail du sol', label: 'Robot de travail du sol' },
  { value: 'Robot de récolte', label: 'Robot de récolte' },
];

const outilOptionsPrecision = [
  { value: 'Système de pulvérisation en bandes', label: 'Système de pulvérisation en bandes' },
  { value: "dont équipé d'un dispositif de coupure de tronçons piloté par GPS", label: "Coupure tronçons piloté GPS" },
  { value: "dont équipé d'un capteur d'avancement de type DPA", label: "Capteur DPA (pulvérisation)" },
  { value: "Épandeur d'engrais minéraux localisé (raie de semins)", label: "Épandeur engrais localisé" },
  { value: "dont équipé d'un capteur d'avancement de type DPA (épandeur engrais)", label: "Capteur DPA (épandeur engrais)" },
  { value: "Épandeur de lisier équipé d'un capteur d'avancement de type DPA", label: "Épandeur lisier capteur DPA" },
  { value: 'Equipements disposant de guidage de haute précision GPS', label: 'Guidage haute précision GPS' },
  { value: "Equipements pilotés à l'aide d'une caméra", label: "Équipements pilotés par caméra" },
  { value: 'Équipements pilotés par un logiciel de cartographie', label: 'Logiciel de cartographie' },
];

const outilOptionsAideDecision = [
  { value: 'Suivi irrigation', label: 'Suivi irrigation' },
  { value: 'Suivi traitements phytosanitaires', label: 'Suivi traitements phytosanitaires' },
  { value: 'Suivi fertilisation', label: 'Suivi fertilisation' },
  { value: 'Cartographie de précision', label: 'Cartographie de précision' },
  { value: 'Station météo connectée', label: 'Station météo connectée' },
  { value: 'Pilotage du climat des serres', label: 'Pilotage du climat des serres' },
];

const outilOptionsLogiciels = [
  { value: 'De la comptabilité', label: 'De la comptabilité' },
  { value: "De l'activité commerciale", label: "De l'activité commerciale" },
  { value: 'Des cultures', label: 'Des cultures' },
  { value: 'Des prairies', label: 'Des prairies' },
  { value: 'Du cheptel', label: 'Du cheptel' },
];

const filiereOptions: { value: Filiere; label: string; icon: 'accueil' | 'radar' | 'carte' }[] = [
  { value: 'accueil', label: 'Accueil', icon: 'accueil' },
  { value: 'comparaison', label: 'Comparaison des filières', icon: 'radar' },
  { value: 'vegetale', label: 'Spécialisation filière végétale', icon: 'radar' },
  { value: 'animale', label: 'Spécialisation filière animale', icon: 'radar' },
  { value: 'carte', label: 'Robotique filière animale', icon: 'carte' },
  { value: 'carte_vegetale', label: 'Robotique filière végétale', icon: 'carte' },
  { value: 'carte_precision', label: 'Matériels de précision', icon: 'carte' },
  { value: 'carte_aide_decision', label: 'Outils d\'aide à la décision', icon: 'carte' },
  { value: 'carte_logiciels', label: 'Logiciels spécialisés', icon: 'carte' },
];

const echelleOptions = [
  { value: 'lineaire', label: 'Linéaire', icon: <Minus /> },
  { value: 'racine_carree', label: 'Racine carrée', icon: <SquareRadical /> },
  { value: 'logarithmique', label: 'Logarithmique', icon: <Search /> },
];

const titles: Record<string, string> = {
  comparaison: 'Comparaison des filières agricoles',
  vegetale: 'Spécialisation filière végétale - Équipement par spécialisation',
  animale: 'Spécialisation filière animale - Équipement par spécialisation',
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
  const [filiere, setFiliere] = useState<Filiere>('accueil');
  const [echelle, setEchelle] = useState<Echelle>('lineaire');
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(new Set());
  const [selectedFilieres, setSelectedFilieres] = useState<Set<string>>(new Set(['vegetale', 'animale']));

  const specialisations = useMemo(() => {
    const carteFilieres: Filiere[] = ['carte', 'carte_vegetale', 'carte_precision', 'carte_aide_decision', 'carte_logiciels'];
    if (filiere === 'comparaison' || carteFilieres.includes(filiere)) return [];
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

  useEffect(() => {
    if (filiere === 'carte' && !outilOptionsAnimal.some(o => o.value === outilSelectionne)) {
      setOutilSelectionne(outilOptionsAnimal[0].value);
    } else if (filiere === 'carte_vegetale' && !outilOptionsVegetale.some(o => o.value === outilSelectionne)) {
      setOutilSelectionne(outilOptionsVegetale[0].value);
    } else if (filiere === 'carte_precision' && !outilOptionsPrecision.some(o => o.value === outilSelectionne)) {
      setOutilSelectionne(outilOptionsPrecision[0].value);
    } else if (filiere === 'carte_aide_decision' && !outilOptionsAideDecision.some(o => o.value === outilSelectionne)) {
      setOutilSelectionne(outilOptionsAideDecision[0].value);
    } else if (filiere === 'carte_logiciels' && !outilOptionsLogiciels.some(o => o.value === outilSelectionne)) {
      setOutilSelectionne(outilOptionsLogiciels[0].value);
    }
  }, [filiere, outilSelectionne]);

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

  const isCarteVue = filiere === 'carte' || filiere === 'carte_vegetale' || filiere === 'carte_precision' || filiere === 'carte_aide_decision' || filiere === 'carte_logiciels';

  const currentViewIndex = filiereOptions.findIndex(o => o.value === filiere);
  const goToPrev = () => {
    const prevIndex = (currentViewIndex - 1 + filiereOptions.length) % filiereOptions.length;
    setFiliere(filiereOptions[prevIndex].value as Filiere);
  };
  const goToNext = () => {
    const nextIndex = (currentViewIndex + 1) % filiereOptions.length;
    setFiliere(filiereOptions[nextIndex].value as Filiere);
  };

  const getLegendItems = () => {
    if (filiere === 'comparaison') {
      return [
        { key: 'vegetale', label: 'Spécialisation filière végétale', color: filiereColors.vegetale, active: selectedFilieres.has('vegetale') },
        { key: 'animale', label: 'Spécialisation filière animale', color: filiereColors.animale, active: selectedFilieres.has('animale') }
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
      <main className="w-full max-w-7xl mx-auto px-6">
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
                  <span className="text-[11px] font-medium text-slate-500">Réalisé par <strong>Nour EL Bachari</strong> &amp; <strong>Asmae HMIDANI</strong></span>
                </div>
              </div>
            </div>

            {/* Onglet Vue */}
            <Card title="Vue">
              <div className="space-y-4">
                <ViewSelect
                  value={filiere}
                  onChange={(v) => setFiliere(v as Filiere)}
                  options={filiereOptions}
                />
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={goToPrev}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-200"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Précédent
                  </button>
                  <span className="text-xs text-slate-500">
                    {currentViewIndex + 1} / {filiereOptions.length}
                  </span>
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-200"
                  >
                    Suivant
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Onglet Paramètres — masqué pour la vue Accueil */}
            {filiere !== 'accueil' && (
              <Card title={isCarteVue ? "Type d'équipement" : "Type d'échelle"}>
                <div className="space-y-4">
                  {isCarteVue ? (
                    <Select
                      value={outilSelectionne}
                      onChange={(v) => setOutilSelectionne(v)}
                      options={
                        filiere === 'carte_vegetale' ? outilOptionsVegetale
                        : filiere === 'carte_precision' ? outilOptionsPrecision
                        : filiere === 'carte_aide_decision' ? outilOptionsAideDecision
                        : filiere === 'carte_logiciels' ? outilOptionsLogiciels
                        : outilOptionsAnimal
                      }
                    />
                  ) : (
                    <IconSelect
                      value={echelle}
                      onChange={(v) => setEchelle(v as Echelle)}
                      options={echelleOptions}
                    />
                  )}
                </div>
              </Card>
            )}

            {filiere !== 'accueil' && (
            <Card title="Données">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                {isCarteVue ? (
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
            )}
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-4">
            {filiere === 'accueil' ? (
              <AccueilPage onViewSelect={(v) => setFiliere(v)} />
            ) : filiere === 'carte' ? (
              <Card>
                <MapChart outilSelectionne={outilSelectionne} csvSource="/robotique_animal.csv" titre="Robotique agricole" />
              </Card>
            ) : filiere === 'carte_vegetale' ? (
              <Card>
                <MapChart outilSelectionne={outilSelectionne} csvSource="/robotique_vegetale.csv" titre="Robotique filière végétale" />
              </Card>
            ) : filiere === 'carte_precision' ? (
              <Card>
                <MapChart outilSelectionne={outilSelectionne} csvSource="/agriculture_precision.csv" titre="Matériels de précision" />
              </Card>
            ) : filiere === 'carte_aide_decision' ? (
              <Card>
                <MapChart outilSelectionne={outilSelectionne} csvSource="/outils_aide_decision.csv" titre="Outils d'aide à la décision" />
              </Card>
            ) : filiere === 'carte_logiciels' ? (
              <Card>
                <MapChart outilSelectionne={outilSelectionne} csvSource="/logiciels_specialises.csv" titre="Logiciels spécialisés" />
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

            {(filiere === 'comparaison' || specialisations.length > 0) && (
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
