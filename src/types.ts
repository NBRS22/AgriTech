export type Filiere =
  | 'accueil'
  | 'comparaison'
  | 'vegetale'
  | 'animale'
  | 'carte'
  | 'carte_vegetale'
  | 'carte_precision'
  | 'carte_aide_decision'
  | 'carte_logiciels';

export type Echelle = 'lineaire' | 'racine_carree' | 'logarithmique';

export const CARTE_FILIERES: Filiere[] = [
  'carte',
  'carte_vegetale',
  'carte_precision',
  'carte_aide_decision',
  'carte_logiciels',
];
