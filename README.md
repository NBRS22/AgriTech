# 🌿 AgriTech Dashboard

> Tableau de bord interactif de visualisation des données d'équipement numérique et robotique dans les exploitations agricoles françaises (2023).

**Réalisé par** : Nour EL Bachari & Asmae HMIDANI

---

## 📸 Aperçu

Le dashboard propose **9 vues** :

| Vue | Type | Description |
|-----|------|-------------|
| **Accueil** | — | Présentation du projet, objectifs, sources et navigation vers les vues |
| **Comparaison des filières** | Radar | Comparatif végétale vs animale sur l'ensemble des indicateurs |
| **Spécialisation filière végétale** | Radar | Taux d'équipement par spécialisation (grandes cultures, viticulture, etc.) |
| **Spécialisation filière animale** | Radar | Taux d'équipement par spécialisation (bovins, ovins, porcins, etc.) |
| **Robotique filière animale** | Carte | Choroplèthe des robots d'élevage par région |
| **Robotique filière végétale** | Carte | Choroplèthe des robots pour la filière végétale |
| **Matériels de précision** | Carte | Choroplèthe des équipements de précision (GPS, DPA, etc.) |
| **Outils d'aide à la décision** | Carte | Choroplèthe des outils (irrigation, fertilisation, etc.) |
| **Logiciels spécialisés** | Carte | Choroplèthe des logiciels (comptabilité, cultures, cheptel, etc.) |

---

## 🛠️ Technologies

| Technologie | Rôle |
|-------------|------|
| **React 19** | Bibliothèque UI |
| **TypeScript** | Typage statique |
| **Vite 7** | Bundler / dev server |
| **Tailwind CSS 4** | Styles utilitaires |
| **D3.js 7** | Graphiques (radar, choroplèthe) |
| **Lucide React** | Icônes (radar, carte, échelles) |

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
│   ├── robotique_animal.csv       # Robots d'élevage (ESEA 2023)
│   ├── robotique_vegetale.csv     # Robots filière végétale
│   ├── agriculture_precision.csv  # Matériels de précision
│   ├── outils_aide_decision.csv   # Outils d'aide à la décision
│   ├── logiciels_specialises.csv  # Logiciels spécialisés
│   └── regions.geojson            # Géométries des régions françaises
├── src/
│   ├── components/
│   │   ├── AccueilPage.tsx        # Page d'accueil (hero, objectifs, vues cliquables)
│   │   ├── Card.tsx               # Composant carte générique
│   │   ├── IconSelect.tsx         # Menu déroulant avec icônes (échelles)
│   │   ├── MapChart.tsx           # Carte choroplèthe D3
│   │   ├── RadarChart.tsx         # Graphique radar D3
│   │   ├── Select.tsx             # Menu déroulant standard
│   │   └── ViewSelect.tsx         # Menu déroulant avec icônes (vues)
│   ├── data/
│   │   └── equipement.ts          # Données INSEE & types
│   ├── types.ts                   # Types partagés (Filiere, Echelle)
│   ├── App.tsx                    # Composant racine, layout & état global
│   ├── index.css                  # Styles globaux (Tailwind)
│   └── main.tsx                   # Point d'entrée
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
Détaille l'équipement par région et par type (robots, matériels de précision, outils d'aide à la décision, logiciels).  
🔗 [Accéder aux données ESEA](https://agreste.agriculture.gouv.fr/agreste-web/disaron/Chd2511/detail/)

---

## 🗂️ Fonctionnalités détaillées

### Navigation
- **Sidebar** : onglets Vue (sélecteur + Précédent/Suivant) et Paramètres (selon la vue)
- **Boutons Précédent/Suivant** : navigation cyclique entre les 9 vues
- **Page d'accueil** : cartes cliquables pour accéder directement à chaque vue

### Graphique Radar
- Comparaison filière végétale vs animale
- Détail par spécialisation avec filtrage (légende cliquable)
- 3 échelles : linéaire, racine carrée, logarithmique (avec icônes)
- Tooltips interactifs, popup donut en mode comparaison

### Cartes choroplèthes (5 vues)
- Découpage régional France métropolitaine
- Sélecteur de type d'équipement selon la vue
- Échelle de couleur quantile (6 niveaux verts)
- Labels adaptatifs (couleur selon fond)
- Tooltip avec rang, nombre d'exploitations et intervalle de confiance
- Panneau Top 3 régions avec médailles

