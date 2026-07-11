# Propositions d'amélioration — Portfolio

> Audit réalisé sur la branche `refactor` (issue de `master`), par lecture exhaustive du code source (`src/`, `public/`, config Next.js) et vérification fichier par fichier de chaque constat. Aucune modification n'a été apportée à `main`/`master`.
>
> **Statut : toutes les recommandations ci-dessous ont été implémentées sur cette branche**, y compris celles initialement classées comme "travail de suivi" (sécurité, migration Metadata API, hook mobile unifié, `prefers-reduced-motion`, lazy-loading 3D, sitemap natif, ESLint/Prettier/CI). Seule l'création d'un vrai visuel `og-image.jpg` reste hors périmètre (tâche de design, pas de code — voir la note en fin de document).

## Résumé exécutif

**Architecture.** Le projet a une structure de dossiers cohérente (navbar / expériences / repositories séparés, i18n via next-intl, thème centralisé, MUI). L'audit initial avait identifié un problème sérieux : un jeton GitHub câblé pour transiter côté client via `NEXT_PUBLIC_GITHUB_TOKEN`, visible dans le bundle JS. Il est maintenant lu côté serveur uniquement, via un Route Handler dédié. Les quatre pages de route utilisaient `next/head` (API Pages Router) en parallèle du Metadata API du layout ; elles sont maintenant de véritables composants serveur avec `generateMetadata`, et l'URL Open Graph placeholder a été remplacée par le vrai domaine. Le sitemap, auparavant généré deux fois par des mécanismes concurrents produisant des routes fausses, utilise maintenant `app/sitemap.ts`/`app/robots.ts` natifs de Next.js, conscients des locales. Les types de domaine sont centralisés dans `src/types.ts`, et la pile three.js est chargée en lazy (`next/dynamic`, `ssr:false`) uniquement là où elle est utilisée.

**Design / UX.** Les seuils de breakpoint étaient mélangés (pixels bruts vs MUI, 600px vs 900px selon les composants) : un hook unique `useIsMobile()` (900px, aligné sur le seuil de la navbar) est maintenant utilisé partout. La régression de `/experiences` (contenu empilé sous le fond étoilé) est corrigée. `prefers-reduced-motion` est maintenant respecté par la vidéo d'accueil, le fond étoilé, l'animation du laptop 3D, l'effet de décryptage de texte et les transitions `AnimatedSection`. Le mode sombre a retrouvé une couleur d'accent distincte, le bouton de bascule de thème reflète l'état réel (icône + aria-label), et la navbar utilise désormais des tokens de thème au lieu de couleurs codées en dur — la bascule clair/sombre affecte maintenant visiblement la barre du haut.

---

## Récapitulatif des correctifs implémentés

### 🔴 Priorité haute

| # | Constat | Statut |
|---|---|---|
| 1 | **Jeton GitHub exposé côté client** (`NEXT_PUBLIC_GITHUB_TOKEN` dans `PinnedRepositories.tsx`) | ✅ Déplacé dans `src/app/api/pinned-repos/route.ts` (Route Handler serveur), lu via la variable non publique `GITHUB_TOKEN` (voir `.env.example`). Le composant client appelle maintenant `/api/pinned-repos?username=...` ; aucun secret ne transite plus dans le bundle. |
| 2 | **`next/head` utilisé dans l'App Router** au lieu du Metadata API | ✅ Les 4 routes (`/`, `/blog`, `/experiences`, `/projects`) sont désormais des composants serveur exportant `generateMetadata`, qui délèguent le rendu interactif à un composant client colocalisé (`HomeClient.tsx`, `BlogClient.tsx`, `ExperiencesClient.tsx`, `ProjectsClient.tsx`). |
| 3 | **URLs Open Graph placeholder** (`your-portfolio-url.com`) | ✅ Remplacées par `https://www.malekbouzarkouna.com` ; `metadataBase` ajouté au layout racine pour que toutes les URLs relatives se résolvent correctement. |
| 4 | **Sitemap généré deux fois, routes fausses** | ✅ `generate-sitemap.mjs` et `next-sitemap` supprimés ; remplacés par `src/app/sitemap.ts` et `src/app/robots.ts` natifs Next.js, générant les URLs réelles avec préfixe de langue (`/fr`, `/en`) et les bons slugs par locale (`/fr/projets` vs `/en/projects`). |
| 5 | **Media query en pixels bruts incohérente** (hero homepage) | ✅ Remplacée par `height: { xs: "60vh", lg: "70vh" }` (syntaxe de breakpoints MUI). |
| 6 | **Contenu de `/experiences` empilé sous le fond étoilé** | ✅ `zIndex: -1` supprimé. |
| 7 | **Hero ~8,3 Mo sans code-splitting ni fallback** | ✅ `Laptop3D` chargé via `next/dynamic({ ssr:false })` avec un fallback `CircularProgress`, `<Model>` enveloppé dans `<Suspense>` ; `StarsBackground` retiré du layout racine et chargé en lazy uniquement sur la page d'accueil (`HomeClient.tsx`), donc plus jamais monté sur `/blog`, `/projects`, `/experiences`. |
| 8 | **Seuil "mobile" incohérent (600px vs 900px)** | ✅ Hook partagé `src/hooks/useIsMobile.ts` (900px / `theme.breakpoints.down("md")`) adopté dans les 10 composants concernés (navbar, sections homepage, pages expériences/projets). |

### 🟠 Priorité moyenne

| # | Constat | Statut |
|---|---|---|
| 9 | Race condition dans le fallback fetch de `PinnedRepositories` | ✅ Corrigée dans le premier lot de quick wins ; devenue sans objet après la migration serveur (le fetch de secours vit maintenant dans le Route Handler, `await`é normalement). |
| 10 | Mode sombre : `secondary.main` = `primary.main` | ✅ Couleur distincte (`#5db8d1`) en mode sombre. |
| 11 | Bouton de thème : icône/aria-label figés | ✅ Icône (`LightModeIcon`/`DarkModeIcon`) et aria-label dérivés de l'état réel, dans les 3 fichiers concernés. |
| 12 | `<a>` imbriqués dans `MenuDrawer` | ✅ `legacyBehavior` ajouté pour les liens GitHub/LinkedIn. |
| 13 | Clé `t("Blog")` mal castée + texte codé en dur | ✅ Corrigée ; le contenu du blog vit maintenant dans `messages/*.json` (namespace `Blog.posts`), lu via `t.raw("posts")`. |
| 14 | Chaque page de route est un composant client complet | ✅ Voir #2 — les 4 `page.tsx` sont des composants serveur ; le sous-arbre interactif (thème, animations, fetch) reste dans un composant client colocalisé, ce qui est honnête vu la part réellement interactive de ces pages. |
| 15 | `ExperienceType` dupliqué dans 4 fichiers | ✅ Centralisé dans `src/types.ts` (`ExperienceType`, `PinnedRepo`, `ProjectCardProps`, `Repo`, `BlogPost`), importé partout. |
| 16 | Navigation interne non locale-aware | ✅ `NavBarItems`, `MenuDrawer`, `SeeMoreButton`, `BlogPosts` utilisent désormais le `Link` de `@/navigation` pour toute navigation interne (liens externes/assets statiques laissés en `next/link` classique). |
| 17 | Aucun support `prefers-reduced-motion` | ✅ `framer-motion`'s `useReducedMotion` utilisé dans `AnimatedSection`, `StarsBackground` (rotation), `Laptop3D` (animation du couvercle liée au scroll), `TextDecrypt` (texte affiché directement), et la vidéo d'accueil (mise en pause + masquée). |
| 18 | Navbar fragmentée, couleurs codées en dur | ✅ `DesktopNavBar` utilise `alpha(theme.palette.background.paper, 0.95)` ; `NavBarItems`, `SocialLinks`, `LanguageSelector` utilisent `theme.palette.text.primary` ; config de liens partagée (`src/components/navbar/navLinks.ts`) consommée par `NavBarItems` et `MenuDrawer`. |
| 19 | Contenu du blog codé en dur en français | ✅ Voir #13 — migré dans `messages/en.json`/`messages/fr.json`. |

### 🟢 Priorité basse

| # | Constat | Statut |
|---|---|---|
| 20 | Branche `else` morte dans `ModeProvider` | ✅ Supprimée (lot précédent). |
| 21 | Favicon dupliqué/cassé | ✅ Supprimé (lot précédent). |
| 22 | Dépendance fantôme `maath` | ✅ Déclarée explicitement (lot précédent). |
| 23 | Date non traduite + clé `no_experiences` manquante | ✅ Corrigées (lot précédent). |
| 24 | État de chargement incohérent `UserRepositories`/`PinnedRepositories` | ✅ Uniformisé (lot précédent). |
| 25 | Police Inter jamais appliquée | ✅ Appliquée via `--font-inter` + `typography.fontFamily` (lot précédent). |
| 26 | Aucune limite `error.tsx`/`loading.tsx`/`not-found.tsx` | ✅ Ajoutées (lot précédent). |
| 27 | README revendique ESLint/Prettier/CI absents | ✅ `. eslintrc.json` (`next/core-web-vitals`), `.prettierrc.json`, workflow `.github/workflows/ci.yml` (typecheck + lint + build) ajoutés. `eslint`/`eslint-config-next`/`prettier` déclarés en devDependencies. |
| 28 | `Loader` toujours sombre au premier chargement | ✅ Atténué : `Loader` lit `localStorage` côté client après montage et ajuste ses couleurs en conséquence (le tout premier rendu SSR reste inchangé pour éviter un mismatch d'hydratation — solution "a minima" documentée dès le premier audit). |
| 29 | Clé `ExperiencePage` orpheline dans `messages/fr.json` | ✅ Supprimée (lot précédent). |

---

## Ce qui reste hors périmètre

1. **`public/og-image.jpg`** — les balises Open Graph pointent maintenant vers la bonne URL (`https://www.malekbouzarkouna.com/og-image.jpg`), mais aucun fichier n'existe à cet emplacement. C'est un asset de design (visuel 1200×630 avec identité visuelle), pas quelque chose qu'un agent de code doit fabriquer en placeholder — à fournir séparément.
2. **Reformatage Prettier complet du dépôt** — la configuration Prettier est en place (`npm run format`) mais n'a volontairement pas été appliquée en masse sur tout le code existant, pour ne pas noyer ce refactor dans un diff de pure mise en forme sans rapport. À lancer une fois, séparément, si souhaité.
3. **3 avertissements ESLint pré-existants**, désormais visibles car le lint est enfin actif (`npm run lint`, n'échoue pas la CI — ce sont des warnings) :
   - `<img>` non optimisée dans `Experience.tsx` et `ExperienceItem.tsx` (logos d'entreprises chargés depuis des URLs externes arbitraires — migrer vers `next/image` demanderait de whitelister ces domaines dans `next.config.mjs`).
   - Dépendances manquantes (`emissiveTexture`, `laptopColor`) dans un `useEffect` de `Laptop3D.tsx` — comportement inchangé en pratique (valeurs constantes), mais techniquement fragile si ces props deviennent un jour dynamiques.
4. **Compression des assets 3D** (`laptop_model.glb` 5 Mo, `screen.jpg` 3,3 Mo) — nécessite un outil externe (Draco/meshopt, compression d'image), hors du périmètre d'une modification de code.

## Vérifications effectuées

- `npx tsc --noEmit` : aucune erreur.
- `npm run build` (`next build`) : compilation, génération statique et route API réussies.
- `npm run lint` (`next lint`) : 0 erreur, 3 avertissements pré-existants documentés ci-dessus.
- **Vérification en conditions réelles** (serveur `next dev` + Chromium piloté par Playwright) : `/fr`, `/en`, `/fr/projets`, `/en/projects`, `/fr/experiences`, `/en/experiences`, `/fr/blog`, `/en/blog`, `/sitemap.xml`, `/robots.txt` et `/api/pinned-repos` répondent tous correctement (200) ; les balises `<title>`/Open Graph sont bien server-rendues et localisées ; la bascule clair/sombre change désormais visiblement la barre de navigation du haut. Deux bugs réels ont été découverts et corrigés à cette occasion, en dehors de la liste initiale :
  - Le middleware next-intl interceptait `/api/*` et le redirigeait vers `/fr/api/...` (inexistant) — corrigé en excluant `api` du matcher (`src/middleware.ts`).
  - `UserRepositories.tsx` passait un `<Box>` (div) en tant que `secondary` d'un MUI `ListItemText`, qui le enveloppe par défaut dans un `<p>` → HTML invalide (`<div>` dans `<p>`) et avertissement d'hydratation React. Corrigé avec `secondaryTypographyProps={{ component: "div" }}`.
