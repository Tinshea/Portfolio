# Guide de mise à jour du contenu

## Projets phares : interface d'admin Keystatic

Les blocs projets s'éditent dans une interface d'admin, **sans toucher au code**. Chaque projet est stocké dans `content/projects/*.json` (une entrée bilingue par projet) ; les images uploadées vont dans `public/images/projects/`.

### En production (le vrai « zéro code, zéro push »)

Une fois la configuration ci-dessous faite : allez sur `https://www.malekbouzarkouna.com/keystatic`, connectez-vous avec votre compte GitHub, éditez ou créez un projet (formulaires FR/EN, glisser-déposer d'images, champ YouTube), cliquez « Commit ». Keystatic committe dans le repo à votre place, Vercel redéploie automatiquement : en ligne en 1 à 2 minutes.

### Configuration initiale (une seule fois, ~5 min)

1. En local, lancez le serveur de dev en mode GitHub :
   ```powershell
   $env:KEYSTATIC_STORAGE = 'github'
   npm run dev
   ```
2. Ouvrez http://localhost:3000/keystatic : Keystatic propose de **créer son app GitHub** pour le repo `Tinshea/Portfolio`. Suivez le flux (2 clics) ; il écrit tout seul 4 variables dans `.env.local` :
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. Copiez ces 4 variables dans **Vercel → Settings → Environment Variables**, puis redéployez.

### En local (pour développer)

`npm run dev` puis http://localhost:3000/keystatic : l'admin écrit directement dans les fichiers locaux (mode local, pas de commit automatique).

### Champs d'un projet

| Champ | Effet |
|---|---|
| Nom | Titre de la carte et de la page (le slug de l'URL en découle) |
| Ordre | Position dans la grille (1 = premier) |
| Descriptions FR/EN | Une ou deux phrases sur la carte |
| Tags | Puces techniques |
| Lien externe | GitHub ou démo. Sans page détaillée, la carte pointe directement dessus |
| Image de la carte / URL externe | Visuel de la carte. Sans rien, un lien GitHub génère une vignette automatiquement |
| **Texte long FR/EN** | **Remplir ce champ crée la page dédiée** (`/fr/projets/slug`, `/en/projects/slug`, ajoutée au sitemap). Une ligne vide sépare les paragraphes |
| Médias | Images uploadées, vidéos YouTube (URL embed `https://www.youtube.com/embed/ID`) ou URL de fichier vidéo, affichés sur la page |
| **Blog → « Afficher aussi dans le blog »** | Le projet apparaît en plus dans la liste du blog (avec la date renseignée), sa carte renvoyant vers la page projet. **Rien à réécrire.** |

Conseil poids : les vidéos vont sur YouTube (mode « non répertorié » si besoin), jamais dans le repo. Les images, compressées, pèsent 100-300 Ko : négligeable.

## Mettre à jour le CV

Déposez le PDF dans `public/assets/` avec le bon nom, le site le détecte tout seul :

| Fichier | Utilisé pour |
|---|---|
| `resume-fr.pdf` | visiteurs en français (s'il existe) |
| `resume-en.pdf` | visiteurs en anglais (s'il existe) |
| `resume.pdf` | repli si le fichier de la langue n'existe pas |

## Ajouter une expérience

Dans `messages/fr.json` et `messages/en.json`, ajoutez une entrée à `Experiences.experiencesData` (mêmes champs que les entrées existantes).

## Ajouter un article de blog

Comme les projets : via l'admin **`/keystatic` → « Articles de blog »**. Un article a un titre EN (qui sert d'URL) et un titre FR optionnel, une date, un résumé FR/EN, et un **corps riche** par langue. Chaque article a sa page `/fr/blog/slug` et `/en/blog/slug`, ajoutée automatiquement au sitemap.

**Le corps d'article est un éditeur riche** (barre d'outils dans l'admin) :

- **Sections et sous-sections** : menu « Heading » de la barre d'outils (niveau 2 = section, niveau 3 = sous-section). En syntaxe : `## Section`, `### Sous-section`.
- **Image à un endroit précis** : bouton image de la barre d'outils, l'upload se place là où est le curseur. En syntaxe : `![légende](/images/posts/fichier.png)`.
- **Vidéo YouTube à un endroit précis** : bouton « + » → bloc « YouTube » → coller l'URL embed (`https://www.youtube.com/embed/VIDEO_ID`).
- Aussi disponibles : gras, italique, liens, listes, citations, code inline et blocs de code.

Le champ « Médias de l'article » en bas de fiche reste disponible pour une galerie de fin d'article, mais l'insertion inline est la méthode recommandée.

C'est l'endroit idéal pour parler de projets qui ne méritent pas la vitrine : un dépôt non épinglé, une expérimentation homelab, un compte rendu de bug intéressant... Tant qu'il n'y a aucun article, la page `/blog` affiche un état vide propre.

**Croisements sans duplication** (le contenu n'est jamais écrit deux fois) :

- Fiche **projet** → section « Blog » → case « Afficher aussi dans le blog » : le projet apparaît dans la liste du blog, sa carte renvoie vers la page projet.
- Fiche **article** → section « Projets phares » → case « Afficher dans les projets phares » (+ ordre, tags et image de carte optionnels) : l'article apparaît comme carte dans la vitrine de l'accueil, sa carte renvoie vers l'article.
