import React from 'react';
import { Card, CardContent, Typography, Box, Chip, useTheme, Theme } from '@mui/material';
import useIsMobile from '@/hooks/useIsMobile';

interface ExperienceCardProps {
  id: number;
  date: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  logo?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  date,
  title,
  company,
  description,
  tags,
  logo
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Card
      sx={{
        marginTop: isMobile ? 1 : 2,
        marginBottom: isMobile ? 1 : 2,
      }}
    >
      <CardContent>
        <ExperienceCardContent
          date={date}
          title={title}
          company={company}
          description={description}
          tags={tags}
          logo={logo}
          isMobile={isMobile}
          theme={theme}
        />
      </CardContent>
    </Card>
  );
};

interface ExperienceCardContentProps {
  date: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  logo?: string;
  isMobile: boolean;
  theme: Theme;
}

const ExperienceCardContent: React.FC<ExperienceCardContentProps> = ({
  date,
  title,
  company,
  description,
  tags,
  logo,
  isMobile,
  theme
}) => (
  <Box
    display="flex"
    flexDirection={isMobile ? 'column' : 'row'} // Sur mobile, on empile les éléments verticalement
    justifyContent="space-between"
    alignItems={isMobile ? 'center' : 'flex-start'} // Alignement centré sur mobile
    p={isMobile ? 1 : 2}
  >
    <Box sx={{ minWidth: isMobile ? '100%' : '150px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
        {date}
      </Typography>
      {
        logo && (
          <Box mt={1} display="flex" justifyContent={isMobile ? 'center' : 'left'}>
            {/* Dark tile keeps light-on-transparent company logos readable in both modes. */}
            <Box
              sx={{
                backgroundColor: '#1b262c',
                borderRadius: 2,
                padding: theme.spacing(1),
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src={logo}
                alt={`${company} logo`}
                style={{
                  maxWidth: "108px",
                  height: 'auto',
                }}
              />
            </Box>
          </Box>
        )
      }
    </Box>

    <Box sx={{ flexGrow: 1, ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, borderTop: isMobile ? 1 : 0, borderLeft: isMobile ? 0 : 1, borderColor: 'divider', pl: isMobile ? 0 : 3, pt: isMobile ? 2 : 0 }}>
      <Typography variant={isMobile ? "h6" : "h5"} component="h3" color="text.primary" textAlign={isMobile ? 'center' : 'left'}>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" textAlign={isMobile ? 'center' : 'left'}>
        {company}
      </Typography>
      <Typography variant="body2" mt={1} color="text.primary" textAlign={isMobile ? 'center' : 'left'}>
        {description}
      </Typography>

      {/* Tags */}
      <Box mt={2} display="flex" justifyContent={isMobile ? 'center' : 'left'} flexWrap="wrap" gap={1}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

export default ExperienceCard;
