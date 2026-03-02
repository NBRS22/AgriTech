import { useState, useMemo, useEffect } from 'react';
import Card from './components/Card';
import Select from './components/Select';
import ViewSelect from './components/ViewSelect';
import IconSelect from './components/IconSelect';
import MapValueToggle from './components/MapValueToggle';
import RadarChart from './components/RadarChart';
import MapChart from './components/MapChart';
import AccueilPage from './components/AccueilPage';
import { equipementData, filiereColors } from './data/equipement';
import { schemeTableau10 } from 'd3-scale-chromatic';
import type { Filiere, Echelle } from './types';
import { CARTE_FILIERES } from './types';
import { ChevronLeft, ChevronRight, Minus, SquareRadical, Search, Info } from 'lucide-react';
import LanguageSwitch from './components/LanguageSwitch';
import { useLanguage } from './context/LanguageContext';

const outilOptionsAnimal = [
  { value: 'Robot affouragement', labelKey: 'equip.robot_affouragement' },
  { value: 'Distributeur automatique', labelKey: 'equip.distributeur' },
  { value: 'Systeme nettoyage automatise', labelKey: 'equip.nettoyage' },
  { value: 'Paillage automatise', labelKey: 'equip.paillage' },
  { value: 'Robot de traite', labelKey: 'equip.robot_traite' },
];

const outilOptionsVegetale = [
  { value: 'Robot de désherbage mécanique', labelKey: 'equip.desherbage' },
  { value: 'Robot de pulvérisation et épandage', labelKey: 'equip.pulverisation' },
  { value: 'Robot de travail du sol', labelKey: 'equip.travail_sol' },
  { value: 'Robot de récolte', labelKey: 'equip.recolte' },
];

const outilOptionsPrecision = [
  { value: 'Système de pulvérisation en bandes', labelKey: 'equip.pulv_bandes' },
  { value: "dont équipé d'un dispositif de coupure de tronçons piloté par GPS", labelKey: 'equip.coupure_gps' },
  { value: "dont équipé d'un capteur d'avancement de type DPA", labelKey: 'equip.capteur_dpa' },
  { value: "Épandeur d'engrais minéraux localisé (raie de semins)", labelKey: 'equip.epandeur_localise' },
  { value: "dont équipé d'un capteur d'avancement de type DPA (épandeur engrais)", labelKey: 'equip.capteur_dpa_engrais' },
  { value: "Épandeur de lisier équipé d'un capteur d'avancement de type DPA", labelKey: 'equip.epandeur_lisier' },
  { value: 'Equipements disposant de guidage de haute précision GPS', labelKey: 'equip.guidage_gps' },
  { value: "Equipements pilotés à l'aide d'une caméra", labelKey: 'equip.camera' },
  { value: 'Équipements pilotés par un logiciel de cartographie', labelKey: 'equip.cartographie' },
];

const outilOptionsAideDecision = [
  { value: 'Suivi irrigation', labelKey: 'equip.suivi_irrigation' },
  { value: 'Suivi traitements phytosanitaires', labelKey: 'equip.suivi_phytosanitaire' },
  { value: 'Suivi fertilisation', labelKey: 'equip.suivi_fertilisation' },
  { value: 'Cartographie de précision', labelKey: 'equip.cartographie_precision' },
  { value: 'Station météo connectée', labelKey: 'equip.station_meteo' },
  { value: 'Pilotage du climat des serres', labelKey: 'equip.climat_serres' },
];

const outilOptionsLogiciels = [
  { value: 'De la comptabilité', labelKey: 'equip.comptabilite' },
  { value: "De l'activité commerciale", labelKey: 'equip.commerce' },
  { value: 'Des cultures', labelKey: 'equip.cultures' },
  { value: 'Des prairies', labelKey: 'equip.prairies' },
  { value: 'Du cheptel', labelKey: 'equip.cheptel' },
];

const outilOptionsByFiliere: Record<string, { value: string; labelKey: string }[]> = {
  carte: outilOptionsAnimal,
  carte_vegetale: outilOptionsVegetale,
  carte_precision: outilOptionsPrecision,
  carte_aide_decision: outilOptionsAideDecision,
  carte_logiciels: outilOptionsLogiciels,
};

const mapChartConfig: Record<string, { csv: string; titreKey: string }> = {
  carte: { csv: '/robotique_animal.csv', titreKey: 'map.robots_animale' },
  carte_vegetale: { csv: '/robotique_vegetale.csv', titreKey: 'map.robots_vegetale' },
  carte_precision: { csv: '/agriculture_precision.csv', titreKey: 'map.precision' },
  carte_aide_decision: { csv: '/outils_aide_decision.csv', titreKey: 'map.aide_decision' },
  carte_logiciels: { csv: '/logiciels_specialises.csv', titreKey: 'map.logiciels' },
};

const filiereOptionKeys: { value: Filiere; labelKey: string; icon: 'accueil' | 'radar' | 'carte' }[] = [
  { value: 'accueil', labelKey: 'view.home', icon: 'accueil' },
  { value: 'comparaison', labelKey: 'view.comparison', icon: 'radar' },
  { value: 'vegetale', labelKey: 'view.vegetale', icon: 'radar' },
  { value: 'animale', labelKey: 'view.animale', icon: 'radar' },
  { value: 'carte', labelKey: 'view.robots', icon: 'carte' },
  { value: 'carte_precision', labelKey: 'view.precision', icon: 'carte' },
  { value: 'carte_aide_decision', labelKey: 'view.aide_decision', icon: 'carte' },
  { value: 'carte_logiciels', labelKey: 'view.logiciels', icon: 'carte' },
];

const echelleOptionKeys = [
  { value: 'lineaire', labelKey: 'scale.linear', icon: <Minus /> },
  { value: 'racine_carree', labelKey: 'scale.sqrt', icon: <SquareRadical /> },
  { value: 'logarithmique', labelKey: 'scale.log', icon: <Search /> },
];

const titleKeys: Record<string, string> = {
  comparaison: 'title.comparison',
  vegetale: 'title.vegetale',
  animale: 'title.animale',
};

const subtitleKeys: Record<string, string> = {
  comparaison: 'subtitle.comparison',
  vegetale: 'subtitle.vegetale',
  animale: 'subtitle.animale',
};

const echelleNoteKeys: Record<Echelle, string> = {
  lineaire: '',
  racine_carree: 'scale.note_sqrt',
  logarithmique: 'scale.note_log',
};

const robotiqueFiliereOptionKeys = [
  { value: 'animale', labelKey: 'view.animale' },
  { value: 'vegetale', labelKey: 'view.vegetale' },
];

export default function App() {
  const { t } = useLanguage();
  const [outilSelectionne, setOutilSelectionne] = useState('Distributeur automatique');
  const [filiere, setFiliere] = useState<Filiere>('accueil');
  const [robotiqueFiliere, setRobotiqueFiliere] = useState<'animale' | 'vegetale'>('animale');
  const [echelle, setEchelle] = useState<Echelle>('lineaire');
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(new Set());
  const [selectedFilieres, setSelectedFilieres] = useState<Set<string>>(new Set(['vegetale', 'animale']));
  const [mapShowPercent, setMapShowPercent] = useState(false);

  const filiereOptions = useMemo(() => filiereOptionKeys.map(o => ({ ...o, label: t(o.labelKey) })), [t]);
  const echelleOptions = useMemo(() => echelleOptionKeys.map(o => ({ ...o, label: t(o.labelKey) })), [t]);
  const robotiqueFiliereOptions = useMemo(() => robotiqueFiliereOptionKeys.map(o => ({ ...o, label: t(o.labelKey) })), [t]);
  const outilOptionsTranslated = useMemo(() => {
    const out: Record<string, { value: string; label: string }[]> = {};
    for (const [k, opts] of Object.entries(outilOptionsByFiliere)) {
      out[k] = opts.map(o => ({ value: o.value, label: t(o.labelKey) }));
    }
    return out;
  }, [t]);

  const effectiveCarteKey = filiere === 'carte' ? (robotiqueFiliere === 'animale' ? 'carte' : 'carte_vegetale') : filiere;
  const specialisations = useMemo(() => {
    if (filiere === 'comparaison' || CARTE_FILIERES.includes(filiere)) return [];
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
    const key = filiere === 'carte' ? (robotiqueFiliere === 'animale' ? 'carte' : 'carte_vegetale') : filiere;
    const options = outilOptionsByFiliere[key];
    if (options && !options.some(o => o.value === outilSelectionne)) {
      setOutilSelectionne(options[0].value);
    }
  }, [filiere, robotiqueFiliere, outilSelectionne]);

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

  const isCarteVue = CARTE_FILIERES.includes(filiere);

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
        { key: 'vegetale', label: t('view.vegetale'), color: filiereColors.vegetale, active: selectedFilieres.has('vegetale') },
        { key: 'animale', label: t('view.animale'), color: filiereColors.animale, active: selectedFilieres.has('animale') }
      ];
    }
    const colors = schemeTableau10;
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
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative">
              <div className="absolute top-4 right-4">
                <LanguageSwitch />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  AgriTech
                </span>
                <div className="w-8 h-px bg-slate-200 rounded-full" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[11px] font-medium text-slate-500">{t('nav.by')} <strong>Nour EL Bachari</strong> &amp; <strong>Asmae HMIDANI</strong></span>
                </div>
              </div>
            </div>

            {/* Onglet Vue */}
            <Card title={t('nav.view')}>
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
                    {t('nav.previous')}
                  </button>
                  <span className="text-xs text-slate-500">
                    {currentViewIndex + 1} / {filiereOptions.length}
                  </span>
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-200"
                  >
                    {t('nav.next')}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Onglet Paramètres — masqué pour la vue Accueil */}
            {filiere !== 'accueil' && (
              <Card title={isCarteVue ? t('nav.settings') : t('nav.scale')}>
                <div className="space-y-4">
                  {filiere === 'carte' ? (
                    <>
                      <Select
                        label={t('param.filiere')}
                        value={robotiqueFiliere}
                        onChange={(v) => setRobotiqueFiliere(v as 'animale' | 'vegetale')}
                        options={robotiqueFiliereOptions}
                      />
                      <Select
                        label={t('param.equipment')}
                        value={outilSelectionne}
                        onChange={(v) => setOutilSelectionne(v)}
                        options={outilOptionsTranslated[effectiveCarteKey] ?? outilOptionsTranslated.carte}
                      />
                      {isCarteVue && (
                        <MapValueToggle
                          value={mapShowPercent ? 'percent' : 'count'}
                          onChange={(v) => setMapShowPercent(v === 'percent')}
                          label={t('param.mapValue')}
                          countLabel={t('map.valueCount')}
                          percentLabel={t('map.valuePercent')}
                        />
                      )}
                    </>
                  ) : isCarteVue ? (
                    <>
                      <Select
                        label={t('param.equipment')}
                        value={outilSelectionne}
                        onChange={(v) => setOutilSelectionne(v)}
                        options={outilOptionsTranslated[filiere] ?? outilOptionsTranslated.carte}
                      />
                      <MapValueToggle
                        value={mapShowPercent ? 'percent' : 'count'}
                        onChange={(v) => setMapShowPercent(v === 'percent')}
                        label={t('param.mapValue')}
                        countLabel={t('map.valueCount')}
                        percentLabel={t('map.valuePercent')}
                      />
                    </>
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
            <Card title={t('nav.data')}>
              <div className="space-y-4">
                {isCarteVue ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('data.agreste')}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {t('data.agresteDesc')}
                    </p>
                    <a
                      href="https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-medium text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors"
                    >
                      {t('data.accessEsea')}
                    </a>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('data.insee')}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {t('data.inseeDesc')}
                    </p>
                    <a
                      href="https://www.insee.fr/fr/statistiques/8616847?sommaire=8616883"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-medium text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors"
                    >
                      {t('data.accessInsee')}
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
            ) : isCarteVue && mapChartConfig[effectiveCarteKey] ? (
              <Card>
                <div className="relative">
                  <div className="absolute top-0 right-0 z-10">
                    <span
                      className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-green-100 text-green-600 cursor-default"
                      title={t('map.chartInfo')}
                    >
                      <Info className="w-4 h-4" />
                    </span>
                  </div>
                  <MapChart
                    outilSelectionne={outilSelectionne}
                    outilLabel={outilOptionsTranslated[effectiveCarteKey]?.find(o => o.value === outilSelectionne)?.label}
                    csvSource={mapChartConfig[effectiveCarteKey].csv}
                    titre={t(mapChartConfig[effectiveCarteKey].titreKey)}
                    farmsByRegionLabel={t('map.farmsByRegion')}
                    showPercent={mapShowPercent}
                  />
                </div>
              </Card>
            ) : (
              <>
            <Card>
              <div className="relative">
                <div className="absolute top-0 right-0 z-10">
                  <span
                    className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-green-100 text-green-600 cursor-default"
                    title={t('map.radarInfo')}
                  >
                    <Info className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{t(titleKeys[filiere])}</h2>
                  <p className="text-slate-500 mt-1">{t(subtitleKeys[filiere])}</p>
                  {echelleNoteKeys[echelle] && (
                    <p className="text-sm text-slate-400 italic mt-1">{t(echelleNoteKeys[echelle])}</p>
                  )}
                </div>

                {(selectedSpecs.size === 0 && filiere !== 'comparaison') || (selectedFilieres.size === 0 && filiere === 'comparaison') ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <p>{t('nav.selectOne')}</p>
                  </div>
                ) : (
                <RadarChart
                    filiere={filiere as 'comparaison' | 'vegetale' | 'animale'}
                    echelle={echelle}
                    selectedSpecialisations={selectedSpecs}
                    allSpecialisations={specialisations}
                    selectedFilieres={selectedFilieres}
                  />
                )}
              </div>
            </Card>

            {(filiere === 'comparaison' || specialisations.length > 0) && (
              <Card
                title={t('nav.legend')}
                actions={
                  <>
                    <button
                      onClick={() => {
                        if (filiere === 'comparaison') setSelectedFilieres(new Set(['vegetale', 'animale']));
                        else setSelectedSpecs(new Set(specialisations));
                      }}
                      className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
                    >{t('nav.all')}</button>
                    <button
                      onClick={() => {
                        if (filiere === 'comparaison') setSelectedFilieres(new Set());
                        else setSelectedSpecs(new Set());
                      }}
                      className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                    >{t('nav.none')}</button>
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
