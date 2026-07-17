import { config, fields, collection, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

// Insertable "YouTube" block for rich-text bodies: serialized as
// {% youtube url="..." caption="..." /%} and rendered as a responsive embed.
const youtubeBlock = block({
  label: 'YouTube',
  schema: {
    url: fields.url({
      label: 'URL embed YouTube',
      description: 'Format : https://www.youtube.com/embed/VIDEO_ID',
    }),
    caption: fields.text({ label: 'Légende (optionnelle)' }),
  },
});

// Admin UI: /keystatic. In production, GitHub mode (commits via the Keystatic
// GitHub App) as soon as the app is configured on Vercel. In dev, local file
// editing — the GitHub env vars in .env must NOT flip dev to GitHub mode, or
// the local admin would show the repo's content instead of the working tree.
// NEXT_PUBLIC_KEYSTATIC_STORAGE=github forces it for the one-time app setup
// (see CONTENT.md). NEXT_PUBLIC_ prefix required: this config also runs in
// the browser, where non-public env vars are undefined.
const useGitHubStorage =
  process.env.NODE_ENV === 'production'
    ? Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG)
    : process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github';

// Expériences et formations partagent la même fiche ; seuls les libellés et
// le dossier d'upload changent. Les composants du site consomment les deux
// via le même type (ExperienceType), donc les clés restent identiques.
function careerSchema(opts: {
  titleLabel: string;
  orgLabel: string;
  imageDirectory: string;
  imagePublicPath: string;
}) {
  return {
    title: fields.slug({
      name: {
        label: `${opts.titleLabel} (EN)`,
        description: 'Version anglaise (sert aussi de nom de fichier).',
      },
    }),
    titleFr: fields.text({
      label: `${opts.titleLabel} (FR)`,
      description: 'Laisser vide pour réutiliser la version EN.',
    }),
    company: fields.text({
      label: opts.orgLabel,
      validation: { length: { min: 1 } },
    }),
    order: fields.integer({
      label: "Ordre d'affichage",
      description: '1 = premier (le plus récent en haut).',
      defaultValue: 99,
    }),
    dateFr: fields.text({
      label: 'Période (FR)',
      description: 'Ex. : Oct 2024 - Présent',
    }),
    dateEn: fields.text({
      label: 'Période (EN)',
      description: 'Ex. : Oct 2024 - Present',
    }),
    descriptionFr: fields.text({ label: 'Description (FR)', multiline: true }),
    descriptionEn: fields.text({ label: 'Description (EN)', multiline: true }),
    tags: fields.array(fields.text({ label: 'Tag' }), {
      label: 'Tags',
      itemLabel: (props) => props.value || 'Tag',
    }),
    logoUrl: fields.url({
      label: 'URL du logo',
      description: 'Logo hébergé ailleurs (SVG/PNG).',
    }),
    logoImage: fields.image({
      label: '... ou logo uploadé',
      directory: opts.imageDirectory,
      publicPath: opts.imagePublicPath,
    }),
  };
}

export default config({
  storage: useGitHubStorage
    ? { kind: 'github', repo: 'Tinshea/Portfolio' }
    : { kind: 'local' },
  ui: {
    brand: { name: 'Portfolio' },
  },
  collections: {
    posts: collection({
      label: 'Articles de blog',
      slugField: 'title',
      path: 'content/posts/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Titre (EN)',
            description: "Sert aussi d'URL de l'article.",
          },
        }),
        titleFr: fields.text({
          label: 'Titre (FR)',
          description: 'Laisser vide pour réutiliser le titre EN.',
        }),
        publishedAt: fields.date({
          label: 'Date de publication',
          validation: { isRequired: true },
        }),
        descriptionFr: fields.text({
          label: 'Résumé (FR)',
          description: 'Affiché sur la carte de la liste.',
          multiline: true,
        }),
        descriptionEn: fields.text({
          label: 'Résumé (EN)',
          multiline: true,
        }),
        bodyFr: fields.markdoc.inline({
          label: 'Article (FR)',
          description: 'Titres, sous-titres, images et vidéos s\'insèrent où vous voulez via la barre d\'outils.',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
          components: { youtube: youtubeBlock },
        }),
        bodyEn: fields.markdoc.inline({
          label: 'Article (EN)',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
          components: { youtube: youtubeBlock },
        }),
        media: fields.array(
          fields.conditional(
            fields.select({
              label: 'Type de média',
              options: [
                { label: 'Image', value: 'image' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Vidéo (URL de fichier)', value: 'video' },
              ],
              defaultValue: 'image',
            }),
            {
              image: fields.object({
                image: fields.image({
                  label: 'Image',
                  directory: 'public/images/posts',
                  publicPath: '/images/posts/',
                }),
                caption: fields.text({ label: 'Légende (optionnelle)' }),
              }),
              youtube: fields.object({
                url: fields.url({
                  label: 'URL embed YouTube',
                  description: 'Format : https://www.youtube.com/embed/VIDEO_ID',
                }),
                caption: fields.text({ label: 'Légende (optionnelle)' }),
              }),
              video: fields.object({
                url: fields.url({ label: 'URL du fichier vidéo' }),
                caption: fields.text({ label: 'Légende (optionnelle)' }),
              }),
            }
          ),
          {
            label: "Médias de l'article",
            itemLabel: (props) => props.discriminant,
          }
        ),
        featured: fields.object(
          {
            showInFeatured: fields.checkbox({
              label: 'Afficher dans les projets phares',
              description:
                "L'article apparaît comme carte dans la vitrine de l'accueil (la carte renvoie vers l'article). Rien à réécrire.",
              defaultValue: false,
            }),
            order: fields.integer({
              label: "Ordre d'affichage",
              description: '1 = premier, mélangé avec les projets.',
              defaultValue: 99,
            }),
            tags: fields.array(fields.text({ label: 'Tag' }), {
              label: 'Tags (affichés sur la carte)',
              itemLabel: (props) => props.value || 'Tag',
            }),
            cardImage: fields.image({
              label: 'Image de la carte',
              description: "Sans image, la première image de l'article est utilisée.",
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            }),
          },
          { label: 'Projets phares' }
        ),
      },
    }),
    projects: collection({
      label: 'Projets phares',
      slugField: 'name',
      path: 'content/projects/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({
          name: {
            label: 'Nom du projet',
            description: 'Affiché sur la carte et la page.',
          },
        }),
        order: fields.integer({
          label: "Ordre d'affichage",
          description: '1 = premier. Les cartes sont triées par ordre croissant.',
          defaultValue: 99,
        }),
        descriptionFr: fields.text({
          label: 'Description courte (FR)',
          description: 'Une ou deux phrases affichées sur la carte.',
          multiline: true,
        }),
        descriptionEn: fields.text({
          label: 'Description courte (EN)',
          multiline: true,
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        link: fields.url({
          label: 'Lien externe (GitHub, démo...)',
          description: "Sans page détaillée, la carte pointe directement dessus. Avec, il devient un bouton sur la page.",
        }),
        cardImage: fields.image({
          label: 'Image de la carte',
          description: 'Optionnelle : un lien GitHub génère une vignette automatiquement.',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        cardImageUrl: fields.url({
          label: "... ou URL d'image externe",
        }),
        blog: fields.object(
          {
            showInBlog: fields.checkbox({
              label: 'Afficher aussi dans le blog',
              description:
                "Le projet apparaît dans la liste du blog (sa carte renvoie vers la page projet). Rien à réécrire.",
              defaultValue: false,
            }),
            publishedAt: fields.date({
              label: 'Date de publication (blog)',
              description: 'Utilisée pour trier la liste du blog.',
            }),
          },
          { label: 'Blog' }
        ),
        page: fields.object(
          {
            bodyFr: fields.text({
              label: 'Texte long (FR)',
              description: 'Remplir ce champ crée la page détaillée. Une ligne vide sépare les paragraphes.',
              multiline: true,
            }),
            bodyEn: fields.text({
              label: 'Texte long (EN)',
              multiline: true,
            }),
            media: fields.array(
              fields.conditional(
                fields.select({
                  label: 'Type de média',
                  options: [
                    { label: 'Image', value: 'image' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Vidéo (URL de fichier)', value: 'video' },
                  ],
                  defaultValue: 'image',
                }),
                {
                  image: fields.object({
                    image: fields.image({
                      label: 'Image',
                      directory: 'public/images/projects',
                      publicPath: '/images/projects/',
                    }),
                    caption: fields.text({ label: 'Légende (optionnelle)' }),
                  }),
                  youtube: fields.object({
                    url: fields.url({
                      label: 'URL embed YouTube',
                      description: 'Format : https://www.youtube.com/embed/VIDEO_ID',
                    }),
                    caption: fields.text({ label: 'Légende (optionnelle)' }),
                  }),
                  video: fields.object({
                    url: fields.url({ label: 'URL du fichier vidéo' }),
                    caption: fields.text({ label: 'Légende (optionnelle)' }),
                  }),
                }
              ),
              {
                label: 'Médias de la page',
                itemLabel: (props) => props.discriminant,
              }
            ),
          },
          { label: 'Page détaillée (optionnelle)' }
        ),
      },
    }),
    experiences: collection({
      label: 'Expériences',
      slugField: 'title',
      path: 'content/experiences/*',
      format: { data: 'json' },
      schema: careerSchema({
        titleLabel: 'Intitulé du poste',
        orgLabel: 'Entreprise',
        imageDirectory: 'public/images/experiences',
        imagePublicPath: '/images/experiences/',
      }),
    }),
    formations: collection({
      label: 'Formations',
      slugField: 'title',
      path: 'content/formations/*',
      format: { data: 'json' },
      schema: careerSchema({
        titleLabel: 'Diplôme',
        orgLabel: 'École / Université',
        imageDirectory: 'public/images/formations',
        imagePublicPath: '/images/formations/',
      }),
    }),
  },
  singletons: {
    about: singleton({
      label: 'À propos',
      path: 'content/about',
      format: { data: 'json' },
      schema: {
        descriptionFr: fields.text({
          label: 'Texte (FR)',
          description: "Le paragraphe de la section « À propos » de l'accueil.",
          multiline: true,
        }),
        descriptionEn: fields.text({
          label: 'Texte (EN)',
          multiline: true,
        }),
        stack: fields.array(fields.text({ label: 'Techno' }), {
          label: 'Stack technique',
          description: 'Les puces affichées à côté du texte.',
          itemLabel: (props) => props.value || 'Techno',
        }),
      },
    }),
    // Les PDF sont nommés d'après la clé du champ (cvFr.pdf / cvEn.pdf) :
    // re-uploader remplace le fichier au lieu d'en accumuler.
    cv: singleton({
      label: 'CV',
      path: 'content/cv',
      format: { data: 'json' },
      schema: {
        cvFr: fields.file({
          label: 'CV (FR)',
          description: 'PDF proposé aux visiteurs francophones.',
          directory: 'public/assets',
          publicPath: '/assets/',
        }),
        cvEn: fields.file({
          label: 'CV (EN)',
          description: 'PDF proposé aux visiteurs anglophones.',
          directory: 'public/assets',
          publicPath: '/assets/',
        }),
      },
    }),
  },
});
