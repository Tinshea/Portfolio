# Guide de mise à jour du contenu

## Projets phares : interface d'admin Keystatic

Les blocs projets s'éditent dans une interface d'admin, **sans toucher au code**. Chaque projet est stocké dans `content/projects/*.json` (une entrée bilingue par projet) ; les images uploadées vont dans `public/images/projects/`.

### En production (le vrai « zéro code, zéro push »)

Une fois la configuration ci-dessous faite : allez sur `https://www.malekbouzarkouna.com/keystatic`, connectez-vous avec votre compte GitHub, éditez ou créez un projet (formulaires FR/EN, glisser-déposer d'images, champ YouTube), cliquez « Commit ». Keystatic committe dans le repo à votre place, Vercel redéploie automatiquement : en ligne en 1 à 2 minutes.

### Configuration initiale (une seule fois, ~5 min)

1. En local, lancez le serveur de dev en mode GitHub :
   ```powershell
   $env:NEXT_PUBLIC_KEYSTATIC_STORAGE = 'github'
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

## Activer le formulaire de contact

Le formulaire de la section Contact s'active avec un compte [Resend](https://resend.com) (gratuit : 100 emails/jour) :

1. Créez un compte Resend et générez une **API key**.
2. Ajoutez `RESEND_API_KEY` dans **Vercel → Settings → Environment Variables** (Production), puis redéployez.
3. Sans domaine vérifié chez Resend, les messages partent de `onboarding@resend.dev` et n'arrivent qu'à l'adresse du compte Resend — créez le compte avec votre adresse. Pour un envoi propre depuis `@malekbouzarkouna.com`, vérifiez le domaine chez Resend puis ajoutez `CONTACT_FROM` (ex. : `Portfolio <contact@malekbouzarkouna.com>`).
4. Optionnel : `CONTACT_TO` pour recevoir ailleurs que sur l'email de `src/data/user.json`.

Sans `RESEND_API_KEY`, le site garde simplement le bouton email direct (comportement actuel).

Quand `CONTACT_FROM` est configuré (domaine vérifié), le visiteur reçoit en plus un **email de confirmation automatique** dans sa langue — générique volontairement, sans recopie de son message.

## Modifier le « À propos »

Via l'admin **`/keystatic` → « À propos »** : le paragraphe FR/EN de l'accueil et la liste des technos affichées à côté (ajouter, supprimer, réordonner les puces).

## Mettre à jour le CV

Via l'admin **`/keystatic` → « CV »** : uploadez le PDF français et/ou anglais, cliquez « Commit ». Chaque visiteur reçoit le PDF de sa langue (repli sur l'autre langue si un seul est fourni).

À défaut, l'ancienne convention par fichiers reste active : déposez le PDF dans `public/assets/` (`resume-fr.pdf`, `resume-en.pdf`, ou `resume.pdf` en dernier repli).

## Ajouter une expérience ou une formation

Via l'admin **`/keystatic` → « Expériences » ou « Formations »** : une fiche bilingue par entrée (intitulé, entreprise/école, période FR/EN, description FR/EN, tags, logo par URL ou upload). Le champ « Ordre » règle le tri (1 = premier, donc le plus récent en haut).

- L'accueil affiche les 3 premières expériences ; la page `/experiences` les liste toutes.
- La section « Formations » de `/experiences` apparaît dès la première fiche créée.

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
