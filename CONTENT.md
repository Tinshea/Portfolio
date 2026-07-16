# Guide de mise à jour du contenu

Tout le contenu éditable vit dans `messages/fr.json` et `messages/en.json` (toujours modifier **les deux**). Aucun changement de code n'est nécessaire pour les opérations ci-dessous.

## Ajouter un bloc « Projet phare » (code ou hors code)

Dans `messages/fr.json` et `messages/en.json`, ajoutez une entrée au tableau `Featured.items` :

```json
{
  "name": "Mon projet",
  "slug": "mon-projet",
  "description": "Une ou deux phrases affichées sur la carte.",
  "tags": ["Tag1", "Tag2"],
  "image": "/projects/mon-projet.jpg",
  "link": "https://github.com/Tinshea/MonProjet",
  "details": {
    "body": "Texte long affiché sur la page du projet.\n\nUne ligne vide (\\n\\n) sépare les paragraphes.",
    "media": [
      { "type": "image", "src": "/projects/mon-projet-1.jpg", "caption": "Légende optionnelle" },
      { "type": "video", "src": "/projects/demo.mp4" },
      { "type": "youtube", "src": "https://www.youtube.com/embed/VIDEO_ID" }
    ]
  }
}
```

Comportement des champs :

| Champ | Obligatoire | Effet |
|---|---|---|
| `name`, `description`, `tags` | oui | Contenu de la carte |
| `image` | non | Visuel de la carte et de la page. Sans `image`, un lien GitHub génère la vignette automatiquement |
| `link` | non | Lien externe (GitHub, démo). Sans `details`, la carte pointe directement dessus ; avec, il devient un bouton sur la page du projet |
| `details` + `slug` | non | **Créent une page dédiée** (`/fr/projets/mon-projet`, `/en/projects/mon-projet`) avec `body` (texte long) et `media`. Le `slug` doit être identique dans les deux langues et est ajouté automatiquement au sitemap |

Types de média : `image` (jpg/png/webp), `video` (mp4/webm local), `youtube` (URL **embed** : `https://www.youtube.com/embed/...`).

Les fichiers locaux (photos, vidéos) se déposent dans `public/projects/` et se référencent par `/projects/nom-du-fichier.ext`.

## Mettre à jour le CV

Déposez simplement le PDF dans `public/assets/` avec le bon nom, le site le détecte tout seul :

| Fichier | Utilisé pour |
|---|---|
| `resume-fr.pdf` | visiteurs en français (s'il existe) |
| `resume-en.pdf` | visiteurs en anglais (s'il existe) |
| `resume.pdf` | repli si le fichier de la langue n'existe pas |

Remplacer un CV = écraser le fichier. Rien d'autre à faire (en production : commit + déploiement).

## Ajouter une expérience

Ajoutez une entrée à `Experiences.experiencesData` dans les deux fichiers de langue (mêmes champs que les entrées existantes : `id`, `title`, `company`, `logo`, `description`, `date`, `tags`).

## Ajouter un article de blog

Ajoutez une entrée à `Blog.posts` (`title`, `date`, `description`, `link`). Tant que le tableau est vide, la page `/blog` affiche un état vide propre.
