# 🌿 AgriTech Dashboard

> Interactive dashboard for visualizing digital and robotic equipment data in French agricultural holdings (2023).

**By** : Nour EL Bachari & Asmae HMIDANI

---

## 📸 Overview

The dashboard offers **9 views**:

| View | Type | Description |
|------|------|-------------|
| **Home** | — | Project presentation, objectives, sources and navigation to views |
| **Sector comparison** | Radar | Crop vs livestock comparison across all indicators |
| **Crop sector specialization** | Radar | Equipment rates by specialization (field crops, viticulture, etc.) |
| **Livestock sector specialization** | Radar | Equipment rates by specialization (cattle, sheep, pigs, etc.) |
| **Livestock robotics** | Map | Choropleth of livestock robots by region |
| **Crop robotics** | Map | Choropleth of crop sector robots |
| **Precision equipment** | Map | Choropleth of precision equipment (GPS, DPA, etc.) |
| **Decision support tools** | Map | Choropleth of tools (irrigation, fertilization, etc.) |
| **Specialized software** | Map | Choropleth of software (accounting, crops, livestock, etc.) |

---

## 🛠️ Technologies

| Technology | Role |
|------------|------|
| **React 19** | UI library |
| **TypeScript** | Static typing |
| **Vite 7** | Bundler / dev server |
| **Tailwind CSS 4** | Utility styles |
| **D3.js 7** | Charts (radar, choropleth) |
| **Lucide React** | Icons (radar, map, scales) |

---

## 🚀 Installation & run

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# 3. Build for production
npm run build

# 4. Preview the build
npm run preview
```

The app is available by default at **http://localhost:5173**.

---

## 📁 Project structure

```
agritech-dashboard/
├── public/
│   ├── robotique_animal.csv       # Livestock robots (ESEA 2023)
│   ├── robotique_vegetale.csv     # Crop sector robots
│   ├── agriculture_precision.csv  # Precision equipment
│   ├── outils_aide_decision.csv   # Decision support tools
│   ├── logiciels_specialises.csv  # Specialized software
│   └── regions.geojson            # French region geometries
├── src/
│   ├── components/
│   │   ├── AccueilPage.tsx        # Home page (hero, objectives, clickable views)
│   │   ├── Card.tsx               # Generic card component
│   │   ├── IconSelect.tsx         # Dropdown with icons (scales)
│   │   ├── MapChart.tsx           # D3 choropleth map
│   │   ├── RadarChart.tsx         # D3 radar chart
│   │   ├── Select.tsx             # Standard dropdown
│   │   └── ViewSelect.tsx         # Dropdown with icons (views)
│   ├── data/
│   │   └── equipement.ts          # INSEE data & types
│   ├── types.ts                   # Shared types (Filiere, Echelle)
│   ├── App.tsx                    # Root component, layout & global state
│   ├── index.css                  # Global styles (Tailwind)
│   └── main.tsx                   # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 📊 Data sources

### INSEE — 2023
Survey on the use of digital technologies in agricultural holdings.  
Covers **crop** and **livestock** sectors by specialization (equipment rates in %).  
🔗 [Access INSEE data](https://www.insee.fr/fr/statistiques/8616847?sommaire=8616883)

### Agreste — ESEA 2023
Survey on the structure of agricultural holdings.  
Details equipment by region and type (robots, precision equipment, decision support tools, software).  
🔗 [Access ESEA data](https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/)

---

## 🗂️ Detailed features

### Navigation
- **Sidebar**: View tabs (selector + Previous/Next) and Settings (depending on view)
- **Previous/Next buttons**: Cyclic navigation between the 9 views
- **Home page**: Clickable cards to access each view directly

### Radar chart
- Crop vs livestock sector comparison
- Detail by specialization with filtering (clickable legend)
- 3 scales: linear, square root, logarithmic (with icons)
- Interactive tooltips, donut popup in comparison mode

### Choropleth maps (5 views)
- Regional breakdown of mainland France
- Equipment type selector depending on view
- Quantile color scale (6 green levels)
- Adaptive labels (color based on background)
- Tooltip with rank, number of holdings and confidence interval
- Top 3 regions panel with medals
