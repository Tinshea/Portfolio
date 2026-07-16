import { config, fields, collection } from '@keystatic/core';
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

// Admin UI: /keystatic. GitHub mode (commits via the Keystatic GitHub App)
// activates once its env vars exist, i.e. on Vercel after the one-time setup
// described in CONTENT.md; otherwise falls back to local file editing.
// Content lives in content/projects/, one JSON file per project.
const useGitHubStorage =
  Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG) ||
  process.env.KEYSTATIC_STORAGE === 'github';

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
  },
});
