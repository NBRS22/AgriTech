import type { Filiere } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AccueilPageProps {
  onViewSelect?: (filiere: Filiere) => void;
}

const OBJECTIVE_KEYS = ['home.obj1', 'home.obj2', 'home.obj3', 'home.obj4'] as const;

export default function AccueilPage({ onViewSelect }: AccueilPageProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-10 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #16a34a 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#4ade80' }} />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10" style={{ background: '#bbf7d0' }} />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-400 bg-opacity-30 border border-green-300 border-opacity-40 rounded-full text-green-100 mb-4 tracking-wide uppercase">
            {t('nav.analytics')}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-3">
            {t('home.hero')}
          </h1>
          <p className="text-green-100 text-base max-w-2xl leading-relaxed">
            {t('home.heroDesc')}
          </p>
        </div>
      </div>

      {/* Objectifs + Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4">{t('home.objectives')}</h2>
          <ul className="space-y-3">
            {OBJECTIVE_KEYS.map((key, i) => (
              <li key={key} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4">{t('home.sources')}</h2>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('data.insee')}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{t('data.inseeDesc')}</p>
              <a
                href="https://www.insee.fr/fr/statistiques/8616847?sommaire=8616883"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-medium text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors"
              >
                {t('data.accessInsee')}
              </a>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('data.agreste')}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{t('data.agresteDesc')}</p>
              <a
                href="https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-medium text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors"
              >
                {t('data.accessEsea')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Vues disponibles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-5">{t('home.views')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { filiere: 'comparaison' as Filiere, titleKey: 'home.view_comparison', descKey: 'home.view_comparison_desc' },
            { filiere: 'vegetale' as Filiere, titleKey: 'home.view_vegetale', descKey: 'home.view_vegetale_desc' },
            { filiere: 'animale' as Filiere, titleKey: 'home.view_animale', descKey: 'home.view_animale_desc' },
            { filiere: 'carte' as Filiere, titleKey: 'home.view_robots', descKey: 'home.view_robots_desc' },
            { filiere: 'carte_precision' as Filiere, titleKey: 'home.view_precision', descKey: 'home.view_precision_desc' },
            { filiere: 'carte_aide_decision' as Filiere, titleKey: 'home.view_aide_decision', descKey: 'home.view_aide_decision_desc' },
            { filiere: 'carte_logiciels' as Filiere, titleKey: 'home.view_logiciels', descKey: 'home.view_logiciels_desc' },
          ].map((v) => (
            <button
              key={v.filiere}
              type="button"
              onClick={() => onViewSelect?.(v.filiere)}
              className="flex gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-green-200 hover:bg-green-50 transition-all duration-200 text-left w-full cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{t(v.titleKey)}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t(v.descKey)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pb-2">
        {t('nav.by')} <span className="font-semibold text-slate-500">Nour EL Bachari</span> &amp; <span className="font-semibold text-slate-500">Asmae HMIDANI</span>
      </div>
    </div>
  );
}
