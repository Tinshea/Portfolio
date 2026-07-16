import { config, fields, collection } from '@keystatic/core';

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
