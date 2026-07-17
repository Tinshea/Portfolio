import React from 'react';
import Image from 'next/image';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
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
}

const ExperienceCardContent: React.FC<ExperienceCardContentProps> = ({
  date,
  title,
  company,
  description,
  tags,
  logo,
  isMobile
}) => (
  <Box
    display="flex"
    flexDirection={isMobile ? 'column' : 'row'} // Sur mobile, on empile les éléments verticalement
    justifyContent="space-between"
    // stretch: la colonne date+logo prend toute la hauteur de la carte, son
    // justifyContent:center centre alors le bloc verticalement.
    alignItems={isMobile ? 'center' : 'stretch'}
    p={isMobile ? 1 : 2}
  >
    <Box sx={{ minWidth: isMobile ? '100%' : '150px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
        {date}
      </Typography>
      {
        logo && (
          <Box mt={1} display="flex" justifyContent="center">
            <Box sx={{ position: 'relative', width: 108, height: 48 }}>
              <Image
                src={logo}
                alt={`${company} logo`}
                fill
                sizes="108px"
                style={{ objectFit: 'contain' }}
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
