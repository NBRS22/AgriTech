# 🌿 AgriTech Dashboard

> Tableau de bord interactif de visualisation des données d'équipement numérique et robotique dans les exploitations agricoles françaises (2023).

**Réalisé par** : Nour EL Bachari & Asmae HMIDANI

---

## 📸 Aperçu

Le dashboard propose 4 vues :

| Vue | Description |
|-----|-------------|
| **Accueil** | Présentation du projet, objectifs et sources |
| **Comparaison par filière** | Radar comparatif végétale vs animale |
| **Filière Végétale / Animale** | Détail par spécialisation avec filtres |
| **Carte — Robotique élevage** | Choroplèthe régionale des robots d'élevage |

---

## 🛠️ Technologies

| Technologie | Rôle |
|-------------|------|
| **React 19** | Bibliothèque UI |
| **TypeScript** | Typage statique |
| **Vite 7** | Bundler / dev server |
| **Tailwind CSS 4** | Styles utilitaires |
| **D3.js 7** | Graphiques (radar, choroplèthe) |
| **Lucide React** | Icônes |

---

## 🚀 Installation & lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en mode développement
npm run dev

# 3. Build pour production
npm run build

# 4. Prévisualiser le build
npm run preview
```

L'application est accessible par défaut sur **http://localhost:5173**.

---

## 📁 Structure du projet

```
agritech-dashboard/
├── public/
│   ├── Robotique.csv         # Données robots d'élevage (Agreste — ESEA 2023)
│   └── regions.geojson       # Géométries des régions françaises
├── src/
│   ├── components/
│   │   ├── AccueilPage.tsx   # Page d'accueil (hero, objectifs, sources)
│   │   ├── Card.tsx          # Composant carte générique
│   │   ├── MapChart.tsx      # Carte choroplèthe D3 (robotique par région)
│   │   ├── RadarChart.tsx    # Graphique radar D3 (équipement numérique)
│   │   └── Select.tsx        # Menu déroulant
│   ├── data/
│   │   └── equipement.ts     # Données INSEE & types TypeScript
│   ├── App.tsx               # Composant racine, layout & état global
│   ├── index.css             # Styles globaux (Tailwind)
│   └── main.tsx              # Point d'entrée
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 📊 Sources de données

### INSEE — 2023
Enquête sur l'utilisation des technologies numériques dans les exploitations agricoles.  
Couvre les filières **végétale** et **animale** par spécialisation (taux d'équipement en %).  
🔗 [Accéder aux données INSEE](https://www.insee.fr/fr/statistiques/8616847?sommaire=8616883)

### Agreste — ESEA 2023
Enquête sur la structure des exploitations agricoles.  
Détaille l'équipement en **robots d'élevage** par région et par type de matériel (nombre d'exploitations).  
🔗 [Accéder aux données ESEA](https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/)

---

## 🗂️ Fonctionnalités détaillées

### Graphique Radar interactif
- Comparaison filière végétale vs animale
- Détail par spécialisation avec filtrage
- 3 échelles : linéaire, racine carrée, logarithmique
- Tooltips interactifs, légende cliquable

### Carte choroplèthe (Robotique élevage)
- Découpage régional France métropolitaine
- Échelle de couleur quantile (6 niveaux verts)
- Labels adaptatifs (couleur selon fond)
- Tooltip avec rang, nombre d'exploitations et IC
- Panneau Top 3 régions avec médailles

---

## 📄 Licence

MIT
