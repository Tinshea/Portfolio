# Propositions d'amélioration — Portfolio

> Audit réalisé sur la branche `refactor` (issue de `master`), par lecture exhaustive du code source (`src/`, `public/`, config Next.js) et vérification fichier par fichier de chaque constat. Aucune modification n'a été apportée à `main`/`master`.

## Résumé exécutif

**Architecture.** Le projet a une structure de dossiers cohérente (navbar / expériences / repositories séparés, i18n via next-intl, thème centralisé, MUI) mais n'a pas reçu de passe architecturale globale. Les quatre pages de route sont des composants client complets qui utilisent encore `next/head` (API Pages Router) en parallèle du Metadata API du layout, ce qui casse les balises SEO et les aperçus de partage social — dont l'URL Open Graph pointe vers un domaine placeholder jamais remplacé. Le problème le plus sérieux est une **fuite de sécurité potentielle** : un jeton GitHub est câblé pour transiter côté client via `NEXT_PUBLIC_GITHUB_TOKEN`, donc visible dans le bundle JS livré au navigateur. Le sitemap est généré deux fois par deux mécanismes concurrents produisant des routes fausses. Les types de domaine et le contenu du blog sont dupliqués/codés en dur, et la pile three.js est chargée globalement sans code-splitting.

**Design / UX.** L'identité visuelle est ambitieuse (vidéo en hero, laptop 3D, fond étoilé, effet de décryptage de texte) mais l'exécution reste à un stade de polish intermédiaire. Les seuils de breakpoint MUI sont mélangés à des media queries en pixels bruts et incohérents d'un composant à l'autre (600px vs 900px). Une régression concrète affecte la page `/experiences`, dont le contenu est empilé sous le canvas WebGL du fond étoilé à cause d'un z-index négatif isolé. L'accessibilité présente de vraies lacunes : aucune prise en charge de `prefers-reduced-motion` malgré cinq sources d'animation permanentes, des boutons de bascule de thème dont l'icône ne reflète jamais l'état réel, et un mode sombre qui perd sa couleur d'accent. Le risque le plus important reste la première impression : ~8,3 Mo de modèle 3D + texture, sans état de chargement, combinés à une vidéo autoplay et un second canvas WebGL permanent, peuvent laisser un visiteur — souvent un recruteur cliquant un lien partagé — face à un écran vide ou saccadé.

Chaque recommandation ci-dessous précise sa **priorité** (impact), son **effort** (taille du correctif) et son **statut** sur cette branche.

---

## 🔴 Priorité haute

| # | Constat | Fichiers | Effort | Statut |
|---|---|---|---|---|
| 1 | **Jeton GitHub exposé côté client** — `PinnedRepositories.tsx` appelle l'API GraphQL GitHub avec `Authorization: Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`. Tout `NEXT_PUBLIC_*` est inliné dans le bundle JS livré au navigateur : si ce jeton est un jour défini, il devient lisible par n'importe qui (onglet Réseau, view-source). | `src/components/repositories/PinnedRepositories.tsx` | Modéré (nouveau route handler) | ⏳ Non implémenté — voir *Travaux de suivi* |
| 2 | **`next/head` utilisé dans l'App Router** — les 4 pages de route sont des composants client qui rendent `next/head` (API Pages Router) pour le SEO, alors que `layout.tsx` exporte déjà correctement `Metadata`. Ces balises ne sont pas garanties d'être présentes dans le HTML lu par les crawlers sociaux. | `src/app/[locale]/{page,blog/page,experiences/page,projects/page}.tsx` | Modéré (conversion en composants serveur) | ⏳ Non implémenté — voir *Travaux de suivi* |
| 3 | **URLs Open Graph placeholder** — `og:url`/`og:image` pointent vers `https://your-portfolio-url.com` au lieu du vrai domaine `https://www.malekbouzarkouna.com`. Casse les aperçus de partage (LinkedIn, Slack, etc.), l'usage principal d'un portfolio partagé. | 4 pages de route | Quick-win | ✅ **Implémenté** |
| 4 | **Sitemap généré deux fois, avec des routes fausses** — `generate-sitemap.mjs` écrit des routes inexistantes (`/about`) ou mal nommées (`/experience`), sans préfixe de langue alors que `localePrefix: 'always'` l'exige, puis `next-sitemap` écrase ce fichier dans la foulée. | `generate-sitemap.mjs`, `package.json`, `public/sitemap.xml` | Quick-win (suppression) / Modéré (config locale complète) | ✅ **Suppression implémentée** — config next-sitemap i18n complète = suivi |
| 5 | **Media query en pixels bruts incohérente** — le hero de la homepage mélange `theme.breakpoints.down("md")` (900px) pour le texte avec `"@media (max-width: 1250px)"` littéral pour la hauteur, un seuil qui ne correspond à aucun breakpoint MUI. | `src/app/[locale]/page.tsx` | Quick-win | ✅ **Implémenté** |
| 6 | **Contenu de `/experiences` empilé sous le fond étoilé** — le conteneur a `zIndex: -1` alors que `StarsBackground` (fixed, plein écran) n'a pas de z-index explicite : le contenu peint visuellement sous le canvas WebGL, seule page du site dans ce cas. | `src/app/[locale]/experiences/page.tsx` | Quick-win | ✅ **Implémenté** |
| 7 | **Hero ~8,3 Mo sans code-splitting ni fallback** — `laptop_model.glb` (5 Mo) + `screen.jpg` (3,3 Mo) chargés sans `<Suspense>`, `StarsBackground` monté globalement sur toutes les pages (y compris `/blog`, `/projects`), aucun `next/dynamic` dans tout le repo. Trois éléments GPU/réseau lourds démarrent en même temps au premier rendu. | `Laptop3D.tsx`, `StarsBackground.tsx`, `AboutMe.tsx`, `layout.tsx` | Modéré | ⏳ Non implémenté — voir *Travaux de suivi* |
| 8 | **Seuil "mobile" incohérent (600px vs 900px)** — la navbar bascule en mode mobile à 900px, mais `AboutMe`, `Experiences`, `PinnedRepositories`, etc. utilisent 600px : entre les deux, la navbar mobile s'affiche au-dessus d'un contenu encore en layout desktop. | 8 fichiers (navbar + sections) | Modéré (hook partagé) | ⏳ Non implémenté — voir *Travaux de suivi* |

---

## 🟠 Priorité moyenne

| # | Constat | Fichiers | Effort | Statut |
|---|---|---|---|---|
| 9 | **Race condition dans le fallback fetch** de `PinnedRepositories` — le fetch de secours n'est pas attendu alors que `finally { setLoading(false) }` s'exécute avant sa résolution ; comme le token n'est jamais défini, ce chemin est probablement emprunté en permanence en production, provoquant un flash de grille vide. | `PinnedRepositories.tsx` | Quick-win | ✅ **Implémenté** |
| 10 | **Mode sombre : `secondary.main` = `primary.main`** — les deux valent `#ffffff` en dark mode (distincts en light mode), donc l'accent utilisé par `StarsBackground` se confond avec le texte uniquement en mode sombre. | `src/themes/index.tsx` | Quick-win | ✅ **Implémenté** |
| 11 | **Bouton de bascule de thème : icône et aria-label figés** — toujours `<LightModeIcon/>` avec un label générique ("LightMode"/"Toggle Mode"), sans jamais refléter l'état actuel ni l'action réelle. | `SideNavBar.tsx`, `SocialLinks.tsx`, `MenuDrawer.tsx` | Quick-win | ✅ **Implémenté** |
| 12 | **`<a>` imbriqués dans `MenuDrawer`** — les liens GitHub/LinkedIn utilisent `<Link passHref>` sans `legacyBehavior` autour d'un `<IconButton component="a">`, produisant un `<a><a>...</a></a>` invalide qui casse l'ordre de tabulation clavier. | `MenuDrawer.tsx` | Quick-win | ✅ **Implémenté** |
| 13 | **Clé de traduction mal castée + texte codé en dur** — `blog/page.tsx` appelle `t("Blog")` alors que seule la clé `Category.blog` existe (repli next-intl garanti) ; `BlogPosts.tsx` affiche "Lire plus" en dur, visible même en anglais. | `blog/page.tsx`, `BlogPosts.tsx`, `messages/*.json` | Quick-win | ✅ **Implémenté** |
| 14 | **Chaque page de route est un composant client complet**, empêchant le SSR et le Metadata API colocalisé — hydrate tout le JS (MUI, next-intl) même pour des titres statiques. | 4 pages de route | Grand chantier | ⏳ Non implémenté — voir *Travaux de suivi* |
| 15 | **`ExperienceType` dupliqué dans 4 fichiers**, `src/types.ts` sous-utilisé (n'exporte que `Locale`). | `src/types.ts` + 4 fichiers | Modéré | ⏳ Non implémenté — voir *Travaux de suivi* |
| 16 | **Navigation interne non locale-aware** — `NavBarItems`, `MenuDrawer`, `SeeMoreButton`, `BlogPosts` utilisent `next/link`/`href` bruts au lieu du `Link` de `@/navigation`, déclenchant une redirection middleware complète au lieu d'une transition client. | 4 fichiers | Modéré | ⏳ Non implémenté — voir *Travaux de suivi* |
| 17 | **Aucun support `prefers-reduced-motion`** — vidéo autoplay, animations framer-motion, rotation du fond étoilé, animation du laptop 3D, effet `TextDecrypt` tournent inconditionnellement pour tous les visiteurs. | 5 fichiers | Modéré | ⏳ Non implémenté — voir *Travaux de suivi* |
| 18 | **Navbar fragmentée avec couleurs codées en dur** — `DesktopNavBar`/`NavBarItems`/`SocialLinks` codent `color: "white"` et un fond fixe au lieu de `theme.palette`, donc la bascule clair/sombre ne change visiblement rien sur la barre du haut. | 5 fichiers navbar | Modéré | ⏳ Non implémenté — voir *Travaux de suivi* |
| 19 | **Contenu du blog codé en dur en français** — le tableau `posts` de `blog/page.tsx` n'est pas issu de `messages/*.json` : un visiteur anglophone voit du contenu français sur `/en/blog`. | `blog/page.tsx` | Modéré | ⏳ Non implémenté — voir *Travaux de suivi* |

---

## 🟢 Priorité basse

| # | Constat | Fichiers | Effort | Statut |
|---|---|---|---|---|
| 20 | Branche `else` morte dans l'effet d'initialisation du thème (`mode` toujours `null` dans la fermeture à dépendances vides). | `ModeProvider.tsx` | Quick-win | ✅ **Implémenté** |
| 21 | Balise favicon manuelle en double, avec un chemin relatif cassé (`favicon.ico` sans `/`, résolu en 404 sur les routes localisées). | `layout.tsx` | Quick-win | ✅ **Implémenté** |
| 22 | Dépendance `maath` importée directement mais absente de `package.json` (dépendance fantôme, tirée en transitif via `@react-three/drei`). | `StarsBackground.tsx`, `package.json` | Quick-win | ✅ **Implémenté** |
| 23 | Date d'expérience non traduite en français (`"Oct 2024 - Present"` copié tel quel) + clé `no_experiences` manquante dans les deux fichiers de messages. | `messages/*.json`, `Experiences.tsx` | Quick-win | ✅ **Implémenté** |
| 24 | État de chargement incohérent : `PinnedRepositories` affiche un `CircularProgress` centré, `UserRepositories` un simple texte "Loading..." non stylé. | `UserRepositories.tsx` | Quick-win | ✅ **Implémenté** |
| 25 | Police Inter importée via `next/font` mais jamais appliquée (aucun `className`, aucun `typography.fontFamily` dans le thème) — les composants MUI restent en Roboto par défaut. | `layout.tsx`, `themes/index.tsx` | Quick-win | ✅ **Implémenté** |
| 26 | Aucune limite `error.tsx` / `loading.tsx` / `not-found.tsx` dans l'App Router — aucun fallback dédié en cas d'erreur de rendu ou de route inconnue. | `src/app/[locale]/` | Quick-win | ✅ **Implémenté** |
| 27 | Le README revendique ESLint/Prettier/CI qui ne sont pas réellement configurés (aucun `.eslintrc*`, `.prettierrc*`, `.github/workflows`). | `README.md`, `package.json` | Modéré (nouvelles dépendances) | ⏳ Non implémenté — voir *Travaux de suivi* |
| 28 | Le `Loader` plein écran est toujours sombre (`#121212`) au premier chargement, même pour un utilisateur en préférence claire, le temps que `ModeProvider` résolve le thème stocké. | `Loader.tsx`, `ModeProvider.tsx` | Modéré | ⏳ Non implémenté — voir *Travaux de suivi* |
| 29 | Clé `HomePage.ExperiencePage` présente dans `messages/fr.json` mais absente de `messages/en.json` et jamais référencée dans le code — résidu mort. | `messages/fr.json` | Quick-win | ✅ **Implémenté** (constat additionnel, hors audit) |

---

## Améliorations rapides implémentées sur cette branche

19 correctifs quick-win ont été appliqués directement (items ✅ ci-dessus) :

- Correction des URLs Open Graph placeholder → `https://www.malekbouzarkouna.com` (4 pages)
- Remplacement de la media query `1250px` par la syntaxe de breakpoints MUI (`page.tsx`)
- Suppression du `zIndex: -1` cassant l'affichage de `/experiences`
- Suppression de `generate-sitemap.mjs` (générateur de sitemap dupliqué et cassé) + nettoyage du script `build`
- Correction de la race condition du fallback fetch dans `PinnedRepositories`
- Couleur d'accent distincte pour le mode sombre (`secondary.main`)
- Icône et aria-label du bouton de thème reflétant l'état réel (3 fichiers)
- Correction des `<a>` imbriqués dans `MenuDrawer` (`legacyBehavior`)
- Correction de la clé `t("Blog")` → `t("blog")` + traduction du bouton "Lire plus"
- Suppression de la branche morte dans `ModeProvider`
- Suppression du favicon dupliqué/cassé dans `layout.tsx`
- Ajout de `maath` aux dépendances explicites de `package.json`
- Traduction de la date d'expérience en français + ajout de la clé `no_experiences`
- Uniformisation de l'état de chargement de `UserRepositories` avec `CircularProgress`
- Application effective de la police Inter (body + thème MUI)
- Ajout de `loading.tsx`, `error.tsx`, `not-found.tsx` pour l'App Router
- Nettoyage de la clé `ExperiencePage` orpheline dans `messages/fr.json`

Chaque changement est volontairement petit, localisé, sans nouvelle dépendance risquée et vérifié par lecture directe du fichier concerné avant modification.

## Travaux de suivi recommandés (non implémentés ici)

Ces points ont un impact réel mais nécessitent un changement de comportement, une nouvelle route serveur, ou touchent trop de fichiers pour rester un "quick win" sûr :

1. **[Sécurité — à faire en priorité]** Déplacer l'appel GitHub GraphQL de `PinnedRepositories` vers un Route Handler serveur (`app/api/pinned-repos/route.ts`) lisant une variable d'environnement non publique (`GITHUB_TOKEN`), afin qu'aucun jeton ne transite jamais dans le bundle client.
2. Migrer les 4 pages de route de `next/head` vers le Metadata API (`generateMetadata`), ce qui implique de les convertir en composants serveur et de redescendre `useTheme`/`useMediaQuery` dans les enfants qui en ont réellement besoin.
3. Configurer `next-sitemap` (ou `app/sitemap.ts` natif) pour émettre les URLs réellement préfixées par langue (`/fr`, `/en`).
4. Ajouter `<Suspense>` autour du modèle 3D, charger `Laptop3D`/`StarsBackground` via `next/dynamic({ ssr: false })`, ne monter `StarsBackground` que sur la page d'accueil, compresser `laptop_model.glb`/`screen.jpg`.
5. Créer un hook `useIsMobile()` partagé (seuil unique, recommandé `md`/900px) et le faire adopter par tous les composants.
6. Centraliser `ExperienceType`/`PinnedRepo`/`Repo`/`BlogPost` dans `src/types.ts`.
7. Remplacer `next/link`/`href` bruts par le `Link` de `@/navigation` dans `NavBarItems`, `MenuDrawer`, `SeeMoreButton`, `BlogPosts`.
8. Ajouter la prise en charge de `prefers-reduced-motion` (hook `useReducedMotion` de framer-motion) pour la vidéo, le fond étoilé, l'animation du laptop et `TextDecrypt`.
9. Extraire une configuration de liens de navigation partagée et remplacer les couleurs codées en dur (`"white"`, `rgba(51,51,51,0.95)`) par des tokens `theme.palette` dans `DesktopNavBar`/`NavBarItems`/`SocialLinks`.
10. Déplacer le contenu du blog dans `messages/*.json` (même pattern que `Experiences.experiencesData`).
11. Ajouter une vraie configuration ESLint/Prettier + un workflow CI GitHub Actions, ou mettre à jour le README pour refléter l'outillage réellement en place.
12. Lire le thème initial de façon synchrone (script inline bloquant ou détection `prefers-color-scheme`) pour éviter le flash sombre du `Loader` plein écran.
13. Créer un véritable asset `public/og-image.jpg` (1200×630) — la balise pointe maintenant vers la bonne URL mais l'image elle-même n'existe pas encore.
