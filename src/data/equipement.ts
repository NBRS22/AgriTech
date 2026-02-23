export interface EquipementData {
  filiere: 'vegetale' | 'animale';
  specialisation: string;
  equipement: string;
  taux: number;
}

export interface UsageData {
  filiere: 'vegetale' | 'animale';
  categorie: string;
  usage: string;
  part: number;
}

export const equipementData: EquipementData[] = [
  { filiere: "vegetale", specialisation: "Grandes cultures", equipement: "logiciel_specialise", taux: 49.0 },
  { filiere: "vegetale", specialisation: "Grandes cultures", equipement: "outil_aide_decision", taux: 43.0 },
  { filiere: "vegetale", specialisation: "Grandes cultures", equipement: "materiel_precision", taux: 52.0 },
  { filiere: "vegetale", specialisation: "Grandes cultures", equipement: "robot", taux: 0.0 },
  { filiere: "vegetale", specialisation: "Maraîchage, horticulture", equipement: "logiciel_specialise", taux: 49.0 },
  { filiere: "vegetale", specialisation: "Maraîchage, horticulture", equipement: "outil_aide_decision", taux: 18.0 },
  { filiere: "vegetale", specialisation: "Maraîchage, horticulture", equipement: "materiel_precision", taux: 12.0 },
  { filiere: "vegetale", specialisation: "Maraîchage, horticulture", equipement: "robot", taux: 2.0 },
  { filiere: "vegetale", specialisation: "Viticulture", equipement: "logiciel_specialise", taux: 45.0 },
  { filiere: "vegetale", specialisation: "Viticulture", equipement: "outil_aide_decision", taux: 39.0 },
  { filiere: "vegetale", specialisation: "Viticulture", equipement: "materiel_precision", taux: 31.0 },
  { filiere: "vegetale", specialisation: "Viticulture", equipement: "robot", taux: 0.0 },
  { filiere: "vegetale", specialisation: "Fruits, autres cultures permanentes", equipement: "logiciel_specialise", taux: 30.0 },
  { filiere: "vegetale", specialisation: "Fruits, autres cultures permanentes", equipement: "outil_aide_decision", taux: 20.0 },
  { filiere: "vegetale", specialisation: "Fruits, autres cultures permanentes", equipement: "materiel_precision", taux: 13.0 },
  { filiere: "vegetale", specialisation: "Fruits, autres cultures permanentes", equipement: "robot", taux: 0.0 },
  { filiere: "vegetale", specialisation: "Polyculture, polyélevage", equipement: "logiciel_specialise", taux: 56.0 },
  { filiere: "vegetale", specialisation: "Polyculture, polyélevage", equipement: "outil_aide_decision", taux: 38.0 },
  { filiere: "vegetale", specialisation: "Polyculture, polyélevage", equipement: "materiel_precision", taux: 50.0 },
  { filiere: "vegetale", specialisation: "Polyculture, polyélevage", equipement: "robot", taux: 0.0 },
  { filiere: "animale", specialisation: "Bovins viande", equipement: "logiciel_specialise", taux: 51.0 },
  { filiere: "animale", specialisation: "Bovins viande", equipement: "outil_aide_decision", taux: 15.0 },
  { filiere: "animale", specialisation: "Bovins viande", equipement: "materiel_precision", taux: 25.0 },
  { filiere: "animale", specialisation: "Bovins viande", equipement: "robot", taux: 18.0 },
  { filiere: "animale", specialisation: "Bovins lait ou mixtes (viande et lait)", equipement: "logiciel_specialise", taux: 76.0 },
  { filiere: "animale", specialisation: "Bovins lait ou mixtes (viande et lait)", equipement: "outil_aide_decision", taux: 40.0 },
  { filiere: "animale", specialisation: "Bovins lait ou mixtes (viande et lait)", equipement: "materiel_precision", taux: 58.0 },
  { filiere: "animale", specialisation: "Bovins lait ou mixtes (viande et lait)", equipement: "robot", taux: 66.0 },
  { filiere: "animale", specialisation: "Ovins, caprins, autres herbivores", equipement: "logiciel_specialise", taux: 42.0 },
  { filiere: "animale", specialisation: "Ovins, caprins, autres herbivores", equipement: "outil_aide_decision", taux: 8.0 },
  { filiere: "animale", specialisation: "Ovins, caprins, autres herbivores", equipement: "materiel_precision", taux: 17.0 },
  { filiere: "animale", specialisation: "Ovins, caprins, autres herbivores", equipement: "robot", taux: 12.0 },
  { filiere: "animale", specialisation: "Porcins, volailles", equipement: "logiciel_specialise", taux: 68.0 },
  { filiere: "animale", specialisation: "Porcins, volailles", equipement: "outil_aide_decision", taux: 32.0 },
  { filiere: "animale", specialisation: "Porcins, volailles", equipement: "materiel_precision", taux: 79.0 },
  { filiere: "animale", specialisation: "Porcins, volailles", equipement: "robot", taux: 21.0 },
  { filiere: "animale", specialisation: "Polyculture, polyélevage", equipement: "logiciel_specialise", taux: 61.0 },
  { filiere: "animale", specialisation: "Polyculture, polyélevage", equipement: "outil_aide_decision", taux: 37.0 },
  { filiere: "animale", specialisation: "Polyculture, polyélevage", equipement: "materiel_precision", taux: 37.0 },
  { filiere: "animale", specialisation: "Polyculture, polyélevage", equipement: "robot", taux: 27.0 },
];

export const usageData: UsageData[] = [
  { filiere: "vegetale", categorie: "Logiciels spécialisés", usage: "Comptabilité", part: 34 },
  { filiere: "vegetale", categorie: "Logiciels spécialisés", usage: "Suivi des cultures", part: 30 },
  { filiere: "vegetale", categorie: "Logiciels spécialisés", usage: "Commerce", part: 21 },
  { filiere: "vegetale", categorie: "Logiciels spécialisés", usage: "Autre", part: 15 },
  { filiere: "vegetale", categorie: "Outils d'aide à la décision", usage: "Phytosanitaire", part: 46 },
  { filiere: "vegetale", categorie: "Outils d'aide à la décision", usage: "Fertilisation", part: 43 },
  { filiere: "vegetale", categorie: "Outils d'aide à la décision", usage: "Irrigation", part: 9 },
  { filiere: "vegetale", categorie: "Outils d'aide à la décision", usage: "Autre", part: 2 },
  { filiere: "vegetale", categorie: "Matériels précision", usage: "Capteur vitesse", part: 36 },
  { filiere: "vegetale", categorie: "Matériels précision", usage: "Guidage haute précision", part: 22 },
  { filiere: "vegetale", categorie: "Matériels précision", usage: "Coupure tronçons", part: 19 },
  { filiere: "vegetale", categorie: "Matériels précision", usage: "Autre", part: 23 },
  { filiere: "vegetale", categorie: "Robots", usage: "Désherbage mécanique", part: 32 },
  { filiere: "vegetale", categorie: "Robots", usage: "Pulvérisation", part: 25 },
  { filiere: "vegetale", categorie: "Robots", usage: "Travail du sol", part: 19 },
  { filiere: "vegetale", categorie: "Robots", usage: "Autre", part: 24 },
  { filiere: "animale", categorie: "Logiciels spécialisés", usage: "Comptabilité", part: 25 },
  { filiere: "animale", categorie: "Logiciels spécialisés", usage: "Gestion animaux", part: 39 },
  { filiere: "animale", categorie: "Logiciels spécialisés", usage: "Commerce", part: 11 },
  { filiere: "animale", categorie: "Logiciels spécialisés", usage: "Autre", part: 25 },
  { filiere: "animale", categorie: "Outils d'aide à la décision", usage: "Phytosanitaire", part: 40 },
  { filiere: "animale", categorie: "Outils d'aide à la décision", usage: "Fertilisation", part: 43 },
  { filiere: "animale", categorie: "Outils d'aide à la décision", usage: "Autre", part: 17 },
  { filiere: "animale", categorie: "Matériels précision", usage: "Surveillance (caméras, GPS)", part: 17 },
  { filiere: "animale", categorie: "Matériels précision", usage: "Régulation bâtiments", part: 24 },
  { filiere: "animale", categorie: "Matériels précision", usage: "Suivi santé", part: 30 },
  { filiere: "animale", categorie: "Matériels précision", usage: "Autre", part: 29 },
  { filiere: "animale", categorie: "Robots automates", usage: "Alimentation", part: 64 },
  { filiere: "animale", categorie: "Robots automates", usage: "Traite", part: 9 },
  { filiere: "animale", categorie: "Robots automates", usage: "Nettoyage", part: 20 },
  { filiere: "animale", categorie: "Robots automates", usage: "Paillage", part: 7 },
];

export const typesEquipement = [
  "logiciel_specialise",
  "outil_aide_decision",
  "materiel_precision",
  "robot"
] as const;

export const equipementLabels: Record<string, string> = {
  logiciel_specialise: "Logiciels spécialisés",
  outil_aide_decision: "Outils d'aide à la décision",
  materiel_precision: "Matériels de précision",
  robot: "Robots"
};

export const filiereColors = {
  vegetale: "#4CAF50",
  animale: "#2196F3"
};
