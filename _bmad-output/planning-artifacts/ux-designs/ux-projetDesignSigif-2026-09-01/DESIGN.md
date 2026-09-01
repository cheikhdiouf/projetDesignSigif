---
name: SIGIF Portail
status: final
updated: 2026-09-01
colors:
  background: '#f7f5ee'
  surface: '#ffffff'
  surface-container: '#f7f5ee'
  outline: '#e6e2d3'
  on-surface: '#1c2321'
  on-surface-variant: '#55625a'
  on-surface-faint: '#94a196'
  primary: '#1b4332'
  primary-dark: '#14321f'
  on-primary: '#ffffff'
  primary-container: '#dcefe1'
  on-primary-container: '#14321f'
  accent-gold: '#f59e0b'
  accent-gold-container: '#fef3c7'
  on-accent-gold-container: '#92610a'
  accent-orange: '#f97316'
  accent-orange-container: '#ffedd5'
  on-accent-orange-container: '#c2410c'
  accent-leaf: '#16a34a'
  accent-leaf-container: '#dcfce7'
  on-accent-leaf-container: '#15803d'
typography:
  family: Inter
  headline-lg:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '700'
    lineHeight: '1.3'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 12.5px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: 0.08em
rounded:
  sm: 8px
  DEFAULT: 10px
  lg: 16px
  full: 999px
spacing:
  unit: 4px
  gutter: 16px
  section-gap: 22px
  card-padding: 20px
sources:
  - https://dtai-prototype-v2.vercel.app/ (référence de charte graphique, capture d'écran fournie par l'utilisateur)
---

## Brand & Style

Le style visuel est un **enterprise utilitaire sobre**, aligné sur la charte du prototype interne de référence (dtai-prototype-v2) : sidebar/bandeaux en vert forêt profond, fond crème chaleureux, cartes blanches nettes, et un jeu d'accents (vert, or, orange) pour distinguer visuellement les modules sans recourir à des couleurs vives ou à des dégradés agressifs. L'objectif est la lisibilité et la confiance — c'est un portail de préparation budgétaire consulté par des acteurs institutionnels, pas une application grand public.

## Colors

- **Fond `background` (#f7f5ee)** : fond de page crème, chaleureux et non clinique.
- **`surface` (#ffffff)** : cartes, bandeaux, conteneurs.
- **`primary` (#1b4332) / `primary-dark` (#14321f)** : vert forêt profond — bandeau "Portail", boutons d'action principaux, éléments de marque (dégradé `primary-dark` → `primary`).
- **`primary-container` (#dcefe1)** : fonds d'icônes/badges sur fond clair liés à l'identité principale.
- **Accents de tuiles** — utilisés en alternance sur les cartes de domaines pour reprendre la diversité des indicateurs du prototype de référence :
  - **`accent-leaf` (#16a34a)** / conteneur `#dcfce7`
  - **`accent-gold` (#f59e0b)** / conteneur `#fef3c7`
  - **`accent-orange` (#f97316)** / conteneur `#ffedd5`
- **`on-surface` (#1c2321)** : texte principal. **`on-surface-variant` (#55625a)** : texte secondaire. **`on-surface-faint` (#94a196)** : texte tertiaire/labels.
- **`outline` (#e6e2d3)** : bordures de cartes et séparateurs, ton crème discret.

## Typography

**Inter** est la seule famille, du header au corps de texte — choix utilitaire cohérent avec un outil métier consulté au quotidien. Les titres de section (`headline-lg`) sont en 800/26px avec un tracking légèrement négatif pour la densité ; les titres de carte (`title-md`) en 700/15px ; le corps en 400/14px ; les libellés capitalisés (`label-caps`) en 700/12px avec tracking large pour les étiquettes de statut ou de section.

## Layout & Spacing

Grille de cartes en `grid` CSS, 3 colonnes en desktop (repli à 2 puis 1 colonne sous 860px/560px). L'unité de base est 4px ; le `gutter` entre cartes est 16px, l'espacement entre sections verticales (`section-gap`) est 22px. Le padding interne des cartes est fixe à 20px pour une densité confortable sans être aérée à l'excès (contexte outil métier, pas éditorial).

## Elevation & Depth

Deux niveaux d'ombre seulement : une ombre de repos très discrète (`shadow`, 1-3px de flou) sur toutes les cartes/bandeaux, et une ombre plus marquée (`shadow-md`, 8-20px de flou) au survol des cartes de domaines, accompagnée d'un léger `translateY(-2px)` et d'un changement de couleur de bordure vers `primary`. Pas d'ombres colorées ni de glow — la profondeur reste neutre et fonctionnelle.

## Shapes

Rayon de coin **10px** par défaut sur les petits éléments (badges, icônes), **14px** sur les cartes et bandeaux principaux. Pas de coins pleinement arrondis (`full`) sauf pour les puces/chips et avatars circulaires. L'ensemble reste anguleux-doux, cohérent avec un outil de gestion plutôt qu'un produit grand public.

## Components

- **Bandeau "Portail" (hero) :** dégradé `primary-dark` → `primary`, texte blanc, coin 14px, padding généreux (30px/32px). Porte le titre d'écran et une phrase de contexte.
- **Cartes de domaine :** fond `surface`, bordure `outline` 1px, icône dans un badge 40×40 coloré selon l'accent assigné, titre + description courte, flèche de navigation en bas à droite dans un badge circulaire `primary-container`. Survol = ombre plus marquée + légère élévation + bordure `primary`.
- **Icônes :** trait fin (stroke-width ~2), style ligne cohérent (Feather/Lucide-like), jamais d'émoji.
- **Puce utilisateur (topbar) :** pastille avatar circulaire `primary-container`, nom sur fond `surface` avec bordure `outline`, forme pilule.
- **Boutons/CTA :** fond `primary`, texte blanc, coin 10px — usage réservé aux actions principales (pas encore présent sur l'écran Portail lui-même, réservé aux écrans enfants).

## Do's and Don'ts

- **Do** garder le vert forêt réservé à la marque/l'action principale ; ne pas l'utiliser comme couleur de fond générique.
- **Do** répartir les 3 accents (vert/or/orange) pour distinguer visuellement les tuiles sans donner de hiérarchie de priorité involontaire entre domaines.
- **Don't** utiliser de dégradés colorés autres que `primary-dark` → `primary` sur le bandeau hero.
- **Don't** introduire d'émojis ou de pictogrammes remplis — rester en icônes ligne fine.
- **Don't** dépasser 3 couleurs d'accent simultanées sur un même écran (au-delà, la charte perd sa lisibilité).
