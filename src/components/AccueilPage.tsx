type Filiere = 'comparaison' | 'vegetale' | 'animale' | 'carte' | 'carte_vegetale' | 'carte_precision' | 'carte_aide_decision' | 'carte_logiciels';

interface AccueilPageProps {
  onViewSelect?: (filiere: Filiere) => void;
}

export default function AccueilPage({ onViewSelect }: AccueilPageProps) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-10 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #16a34a 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#4ade80' }} />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10" style={{ background: '#bbf7d0' }} />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-400 bg-opacity-30 border border-green-300 border-opacity-40 rounded-full text-green-100 mb-4 tracking-wide uppercase">
            Tableau de bord analytique
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-3">
            AgriTech — Équipement numérique<br />
            <span className="text-green-300">des exploitations agricoles</span>
          </h1>
          <p className="text-green-100 text-base max-w-2xl leading-relaxed">
            Ce tableau de bord explore l'adoption des technologies numériques et des équipements robotiques
            dans les exploitations agricoles françaises, à partir des données officielles de l'INSEE et d'Agreste.
          </p>
        </div>
      </div>

      {/* Objectifs + Sources côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectifs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4">Objectifs</h2>
          <ul className="space-y-3">
            {[
              "Analyser les taux d’équipement numérique par filière agricole (végétale & animale)",
              "Comparer l’adoption technologique selon les spécialisations",
              "Visualiser la répartition géographique des robots d’élevage par région",
              "Identifier les disparités entre types d’exploitations",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Sources */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4">Sources de données</h2>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">INSEE — 2023</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Enquête sur l'utilisation des technologies numériques dans les exploitations agricoles.
                Couvre les filières végétale et animale par spécialisation.
              </p>
              <a
                href="https://www.insee.fr/fr/statistiques/8616847?sommaire=8616883"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-medium text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors"
              >
                Accéder aux données INSEE →
              </a>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Agreste — ESEA 2023</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Enquête sur la structure des exploitations agricoles. Détaille l'équipement en robots
                d'élevage par région et par type de matériel.
              </p>
              <a
                href="https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-medium text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors"
              >
                Accéder aux données ESEA →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Vues disponibles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-5">Vues disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { filiere: 'comparaison' as Filiere, title: 'Comparaison des filières', desc: "Vue radar comparative entre filières végétale et animale sur l'ensemble des indicateurs numériques." },
            { filiere: 'vegetale' as Filiere, title: 'Spécialisation filière végétale', desc: "Détail des taux d'équipement numérique pour chaque spécialisation de la production végétale." },
            { filiere: 'animale' as Filiere, title: 'Spécialisation filière animale', desc: "Analyse des équipements numériques dans les différentes spécialisations de l'élevage." },
            { filiere: 'carte' as Filiere, title: 'Carte — Robotique filière animale', desc: "Choroplèthe régionale indiquant le nombre d'exploitations équipées en robots d'élevage (ESEA 2023)." },
            { filiere: 'carte_vegetale' as Filiere, title: 'Carte — Robotique filière végétale', desc: "Choroplèthe régionale des exploitations équipées en robots pour la filière végétale (ESEA 2023)." },
            { filiere: 'carte_precision' as Filiere, title: 'Carte — Matériels de précision', desc: "Choroplèthe régionale des exploitations équipées en matériels de précision (ESEA 2023)." },
            { filiere: 'carte_aide_decision' as Filiere, title: 'Carte — Outils d\'aide à la décision', desc: "Choroplèthe régionale des exploitations équipées en outils d'aide à la décision (ESEA 2023)." },
            { filiere: 'carte_logiciels' as Filiere, title: 'Carte — Logiciels spécialisés', desc: "Choroplèthe régionale des exploitations équipées en logiciels spécialisés (ESEA 2023)." },
          ].map((v) => (
            <button
              key={v.filiere}
              type="button"
              onClick={() => onViewSelect?.(v.filiere)}
              className="flex gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-green-200 hover:bg-green-50 transition-all duration-200 text-left w-full cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{v.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer auteurs */}
      <div className="text-center text-xs text-slate-400 pb-2">
        Réalisé par <span className="font-semibold text-slate-500">Nour EL Bachari</span> &amp; <span className="font-semibold text-slate-500">Asmae HMIDANI</span>
      </div>
    </div>
  );
}
