# 🌿 AgriTech Dashboard

🔗 **Project link:** https://github.com/your-repository/agritech-dashboard

Interactive dashboard for exploring the **digital transformation of French agricultural holdings (2023)** through robots, precision agriculture equipment, decision support tools, and specialized software.

**Authors:**  
Nour EL Bachari  
Asmae HMIDANI

---

## 📖 Project Overview

Agriculture is currently undergoing a major digital transformation.  
Technologies such as **robots, precision equipment, software, and decision-support tools** are increasingly used to improve productivity, optimize inputs, and adapt to environmental constraints.

However, the adoption of these technologies is **not uniform**. It varies according to:

- agricultural sectors (crop vs livestock),
- regional specializations,
- economic and climatic constraints.

This project explores these differences through **interactive data visualizations** built from official French statistics.

---

## 🌾 Context

![Agriculture numérique](https://images.unsplash.com/photo-1592982537447-7440770cbfc9)

Digital technologies are becoming essential for modern agriculture.  
They help farmers optimize irrigation, fertilization, livestock management, and crop monitoring.

Understanding **where and how these technologies are adopted** is key to analyzing the digital transition of agriculture.

---

## 🎯 Objectives

The dashboard aims to:

- **Visualize** the digital transformation of French agriculture
- **Compare** technological adoption between crop and livestock sectors
- **Analyze** equipment rates by agricultural specialization
- **Examine** regional disparities in technology adoption

---

## 📊 Dashboard Overview

The dashboard contains **9 interactive views**.

| View | Visualization | Description |
|------|---------------|-------------|
| Home | Navigation | Project presentation |
| Sector comparison | Radar chart | Crop vs livestock equipment rates |
| Crop specialization | Radar chart | Equipment by crop specialization |
| Livestock specialization | Radar chart | Equipment by livestock specialization |
| Livestock robots | Map | Regional distribution of livestock robots |
| Crop robots | Map | Regional distribution of crop robots |
| Precision equipment | Map | GPS, DPA, and precision agriculture equipment |
| Decision support tools | Map | Irrigation, fertilization, and monitoring tools |
| Specialized software | Map | Accounting, crop, and livestock management |

---

## 🧠 State of the Art

The dashboard uses visualization techniques commonly applied in **agricultural data analysis and regional statistics**.

### Radar Charts

Radar charts are useful for comparing **multiple indicators across categories**.  
They allow a direct comparison between **agricultural sectors and specializations**.

They were chosen here to highlight:
- differences between crop and livestock sectors,
- differences between agricultural specializations,
- equipment profiles across several digital technologies.

### Choropleth Maps

Choropleth maps are widely used in **regional and territorial analysis**.

They make it possible to:
- identify spatial disparities,
- compare regions,
- reveal concentration effects in technology adoption.

They are particularly relevant here because the project focuses on **regional differences in agricultural digitalization**.

### Interactive Exploration

The dashboard includes:
- dynamic filters,
- tooltips,
- multiple scales,
- view navigation.

These interactions improve readability and allow users to explore the dataset progressively.

---

## 🛠️ Technologies

| Technology | Role |
|------------|------|
| React 19 | User interface |
| TypeScript | Static typing |
| Vite | Development server |
| Tailwind CSS | Styling |
| D3.js | Data visualization |
| Lucide React | Icons |

---

## 🚀 Installation

```bash
npm install
npm run dev
```

Open the app at:

```
http://localhost:5173
```

---

## 📁 Project Structure

```
agritech-dashboard/
├── public/
│   ├── robotique_animal.csv
│   ├── robotique_vegetale.csv
│   ├── agriculture_precision.csv
│   ├── outils_aide_decision.csv
│   ├── logiciels_specialises.csv
│   ├── exploitations_agricoles_france_2023.csv
│   └── regions.geojson
├── src/
│   ├── components/
│   │   ├── AccueilPage.tsx
│   │   ├── Card.tsx
│   │   ├── IconSelect.tsx
│   │   ├── InfoTooltip.tsx
│   │   ├── LanguageSwitch.tsx
│   │   ├── MapChart.tsx
│   │   ├── MapValueToggle.tsx
│   │   ├── RadarChart.tsx
│   │   ├── Select.tsx
│   │   └── ViewSelect.tsx
│   ├── context/
│   │   └── LanguageContext.tsx
│   ├── data/
│   │   └── equipement.ts
│   ├── i18n/
│   │   └── translations.ts
│   ├── types.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 📊 Data Sources

### INSEE — 2023

Survey on the use of digital technologies in agricultural holdings.  
This source provides:

- equipment rates by sector,
- specialization-level comparisons,
- usage categories for each type of technology.

🔗 https://www.insee.fr/fr/statistiques/8616847

### Agreste — ESEA 2023

Survey on the structure of agricultural holdings.  
This source provides:

- detailed regional data,
- counts of equipped holdings,
- categories such as robotics, precision equipment, decision-support tools, and software.

🔗 https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/

---

## 🔍 Main Features

### Navigation

- Sidebar with view selection
- Previous / Next navigation
- FR / EN language switch
- Interactive home page

### Radar Views

- Sector comparison (crop vs livestock)
- Specialization comparison
- Interactive legend filtering
- Linear, square root, and logarithmic scales
- Donut chart on point selection

### Map Views

- Choropleth maps of mainland France
- Equipment selector by view
- Quantile color scale
- Effectif / Taux régional toggle
- Top 3 regions panel
- Tooltips and labels

---

## 📈 Key Insights

The visualizations reveal several major trends in the digital transformation of French agriculture.

### Sector Differences

The livestock sector shows higher adoption rates of robotics, especially in dairy and intensive livestock systems.

### Precision Agriculture

Precision equipment such as GPS guidance systems, DPA sensors, and localized spreaders is widely adopted in crop production.

### Regional Disparities

Technology adoption is strongly linked to regional agricultural specialization.

Examples:
- **Brittany** → livestock robotics
- **Nouvelle-Aquitaine / Occitanie** → precision equipment
- **Grand Est / Hauts-de-France** → strong technological intensity

### Progressive Digitalization

Specialized software and decision-support tools are broadly diffused, showing that agricultural digitalization often starts with management and optimization tools before advanced automation.

---

## 📌 Conclusion

The AgriTech dashboard shows that the digital transformation of agriculture in France is real, but uneven.

It is shaped by:

- production sector,
- regional specialization,
- climatic constraints,
- and economic rationality.

Rather than a uniform technological revolution, the results reveal a **progressive, specialized, and territorially differentiated digital transition**.
