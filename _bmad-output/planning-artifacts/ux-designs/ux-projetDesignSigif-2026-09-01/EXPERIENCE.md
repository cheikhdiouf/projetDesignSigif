---
name: SIGIF Portail
status: final
sources:
  - Croquis manuscrit initial (photo tableau blanc)
  - https://dtai-prototype-v2.vercel.app/ (référence de charte graphique)
updated: 2026-09-01
---

# SIGIF Portail — Experience Spine

> Écran "Portail / Accueil" du système SIGIF (gestion intégrée de la préparation budgétaire). Commun à tous les microservices (MS), point d'entrée unique après connexion, visible par tous les acteurs. Paire avec `DESIGN.md` (SIGIF Portail).

## Foundation

Application web métier, single-surface responsive (desktop-first, repli tablette/mobile). Pas de librairie de composants imposée à ce stade — HTML/CSS autonome (`mockups/portail-ecran-accueil.html`) servant de référence visuelle. `DESIGN.md` porte l'identité visuelle (couleurs, typographie, formes) ; ce document porte le comportement. Multi-acteurs, multi-habilitations : un même écran Portail est partagé par tous les profils, mais l'accès à chaque domaine fonctionnel est filtré par les droits de l'utilisateur connecté.

## Information Architecture

| Surface | Atteinte depuis | Objectif |
|---|---|---|
| Portail / Accueil | Redirection automatique après connexion | Point d'entrée unique ; expose les 7 domaines fonctionnels du processus de préparation budgétaire |
| Gestion des référentiels (MS) | Carte "Gestion des référentiels" | Administration des données de référence communes |
| Planification des crédits (MS) | Carte "Planification des crédits" | Programmation et répartition des enveloppes budgétaires |
| Cadrage budgétaire (MS) | Carte "Cadrage budgétaire" | Définition des plafonds et orientations budgétaires |
| Marquage (MS) | Carte "Marquage" | Identification et suivi des lignes budgétaires |
| GAR / Cadrage de performance (MS) | Carte "GAR / Cadrage de performance" | Gestion axée sur les résultats, suivi de performance |
| Dialogue (MS) | Carte "Dialogue" | Échanges et arbitrages entre acteurs du processus |
| PLF (MS) | Carte "PLF" | Élaboration du Projet de Loi de Finances |

Le Portail est un hub plat — aucune carte ne contient de sous-navigation à ce niveau ; chaque carte est une porte d'entrée vers un microservice indépendant. Pas de niveau de profondeur supplémentaire prévu sur cet écran.

→ Référence de composition : `mockups/portail-ecran-accueil.html`. Le spine gagne en cas de conflit.

## Voice and Tone

Microcopy. La posture de marque vit dans `DESIGN.md.Brand & Style`.

| Do | Don't |
|---|---|
| "Portail" / "Accueil" — sobre, factuel | "Bienvenue sur votre espace magique !" |
| Libellés de domaine tels quels ("Cadrage budgétaire", "Marquage") | Reformulations familières ou abrégées imprévisibles |
| Descriptions courtes, verbe d'action implicite ("Administration des données de référence…") | Phrases marketing ou incitatives |
| Un seul registre pour tous les acteurs (le portail est commun) | Ton différent selon le profil connecté |

## Component Patterns

Comportemental. Les specs visuelles vivent dans `DESIGN.md.Components`.

| Composant | Usage | Règles comportementales |
|---|---|---|
| Carte de domaine | Grille Portail | Toute la carte est cliquable (pas seulement la flèche) ; ouvre le microservice correspondant dans le même onglet. Survol = léger déplacement vertical + ombre accentuée (`DESIGN.md.Elevation`). |
| Badge d'icône coloré | Carte de domaine | Couleur assignée par domaine parmi `{colors.accent-leaf}` / `{colors.accent-gold}` / `{colors.accent-orange}` — fixe par domaine, ne change pas dynamiquement. |
| Bandeau "Portail" (hero) | Haut d'écran | Statique, pas d'action ; porte le titre et une phrase de contexte courte. |
| Puce utilisateur | Barre supérieure | Affiche l'identité de l'utilisateur connecté ; ouvre le menu de compte/déconnexion au clic (comportement à spécifier lors du MS Authentification/Habilitations). |
| Flèche de carte | Carte de domaine | Purement indicative (affordance de navigation), ne porte pas d'action propre distincte du clic sur la carte entière. |

## State Patterns

| État | Surface | Traitement |
|---|---|---|
| Domaine autorisé | Carte de domaine | Affichage plein, couleurs normales, cliquable (état par défaut documenté ici). |
| Domaine non habilité | Carte de domaine | **[ASSUMPTION]** Non encore spécifié — deux options possibles : carte grisée non cliquable, ou carte masquée. À confirmer avec le porteur des habilitations avant implémentation (voir Open Item ci-dessous). |
| Chargement initial du Portail | Portail / Accueil | **[ASSUMPTION]** Squelettes de cartes (gris clair, mêmes proportions) le temps de résoudre les habilitations utilisateur. |
| Aucun domaine autorisé | Portail / Accueil | **[ASSUMPTION]** Message d'état vide invitant à contacter l'administrateur des habilitations — non maquetté à ce stade. |

## Interaction Primitives

- **Clic** — sur une carte de domaine : navigation vers le microservice. Cible tactile ≥ 44px (respecté par le padding 20px des cartes).
- **Survol (desktop)** — élévation de la carte + changement de couleur de bordure vers `{colors.primary}` ; retour immédiat, pas de délai.
- **Clavier** — chaque carte de domaine est un lien (`<a>`) focusable au Tab, activable à `Enter` ; ordre de tabulation = ordre de lecture de la grille (gauche à droite, haut en bas).

## Accessibility Floor

Comportemental. Le contraste visuel vit dans `DESIGN.md`.

- Chaque carte de domaine est un élément de lien natif (pas un `div` avec `onclick`), pour garantir la navigation clavier et le support lecteur d'écran sans JavaScript additionnel.
- Le texte de description de chaque domaine sert de contexte accessible ; pas de contenu porté uniquement par la couleur du badge d'icône (l'icône elle-même reste distinctive par sa forme).
- Grille responsive : 3 colonnes desktop → 2 colonnes tablette (≤860px) → 1 colonne mobile (≤560px), sans perte de contenu ni de fonctionnalité.

## Key Flows

**Fatou, gestionnaire de programme, se connecte un lundi matin pour préparer sa campagne budgétaire.**

1. Fatou entre ses identifiants sur l'écran de connexion.
2. Elle est redirigée automatiquement vers le Portail — aucune étape intermédiaire.
3. Elle voit le bandeau "Portail / Accueil" et la grille des domaines fonctionnels ; seuls les domaines pour lesquels elle a des droits apparaissent pleinement actifs.
4. **Climax :** elle repère la carte "Cadrage budgétaire" (badge orange), la survole — la carte se soulève légèrement — et clique dessus.
5. Elle est amenée directement dans le microservice Cadrage budgétaire, prête à travailler, sans navigation supplémentaire ni redondance de menu.

---

## Open Items

- **[NOTE FOR UX]** Le traitement visuel des domaines non habilités (grisé vs masqué) n'a pas été tranché — impacte `State Patterns` et potentiellement `DESIGN.md.Components`. À lever avant le développement du filtrage par habilitations.
- **[ASSUMPTION]** L'écran Portail ne porte pas de recherche ni de notifications à ce stade (absent du croquis initial et non demandé) — à confirmer si le besoin apparaît lors de la spécification des autres MS.
