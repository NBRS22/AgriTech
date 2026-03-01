import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Langue"
      className="inline-flex p-0.5 rounded-md bg-slate-50/80 border border-slate-200/80"
    >
      <button
        type="button"
        onClick={() => setLocale('fr')}
        className={`px-1.5 py-0.5 text-[9px] font-medium rounded transition-all duration-200 ${
          locale === 'fr'
            ? 'bg-green-500 text-white'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/80'
        }`}
        title="Français"
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-1.5 py-0.5 text-[9px] font-medium rounded transition-all duration-200 ${
          locale === 'en'
            ? 'bg-green-500 text-white'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/80'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
