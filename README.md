# AgriTech Dashboard

Application web moderne de visualisation des données d'équipement numérique agricole en France (2023).

## Technologies utilisées

- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite 7** - Bundler rapide
- **Tailwind CSS 4** - Framework CSS utilitaire
- **D3.js 7** - Visualisations de données
- **Lucide React** - Icônes

## Fonctionnalités

### Graphique Radar interactif
- Comparaison des filières végétale et animale
- Vue détaillée par spécialisation
- 3 types d'échelles : linéaire, racine carrée, logarithmique
- Filtrage des spécialisations
- Tooltips interactifs
- Légende cliquable pour mise en évidence

### Graphiques d'usages
- Répartition des usages par catégorie d'équipement
- Barres de progression animées
- Filtrage par filière

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## Structure du projet

```
agritech-dashboard/
├── src/
│   ├── components/       # Composants React réutilisables
│   │   ├── Card.tsx
│   │   ├── FilterCheckbox.tsx
│   │   ├── Header.tsx
│   │   ├── RadarChart.tsx
│   │   ├── Select.tsx
│   │   ├── StatCard.tsx
│   │   └── UsageCharts.tsx
│   ├── data/
│   │   └── equipement.ts # Données et types
│   ├── App.tsx           # Composant principal
│   ├── index.css         # Styles globaux
│   └── main.tsx          # Point d'entrée
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Données

Les données proviennent de l'enquête "Pratiques culturales 2023" et incluent :

- **Taux d'équipement** par filière (végétale/animale), spécialisation et type d'équipement
- **Répartition des usages** pour chaque catégorie d'équipement numérique

## Licence

MIT
