import React from 'react';
import { Card, CardContent, Typography, Box, Chip, useTheme, CardActionArea } from '@mui/material';
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
  id,
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
        color: theme.palette.primary.main,
        borderRadius: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: theme.palette.background.paper,
        boxShadow: `1px 1px 1px rgba(0, 0, 0, 0.2)`,
        '&:hover': {
            transform: 'scale(1.01)',
        },
        opacity: 0.99,
      }}
    >
      <CardActionArea>
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
      </CardActionArea>
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
  theme: any;
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
      <Typography variant="body2" color="textSecondary">
        {date}
      </Typography>
      {
        logo && (
          <Box mt={1} display="flex" justifyContent={isMobile ? 'center' : 'left'}>
            <img
              src={logo}
              alt="Company Logo"
              style={{
                maxWidth: "124px",
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </Box>
        )
      }
    </Box>

    <Box sx={{ flexGrow: 1, ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, borderTop: isMobile ? 1 : 0, borderLeft: isMobile ? 0 : 1, borderColor: 'primary.main', pl: isMobile ? 0 : 3, pt: isMobile ? 2 : 0 }}>
      <Typography variant={isMobile ? "h6" : "h5"} color="primary" textAlign={isMobile ? 'center' : 'left'}>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" textAlign={isMobile ? 'center' : 'left'}>
        {company}
      </Typography>
      <Typography variant="body2" mt={1} textAlign={isMobile ? 'center' : 'left'}>
        {description}
      </Typography>

      {/* Tags */}
      <Box mt={2} display="flex" justifyContent={isMobile ? 'center' : 'left'} flexWrap="wrap" gap={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            variant="outlined"
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              fontSize: isMobile ? '0.8rem' : '1rem', // Taille de la police réduite sur mobile
            }}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

export default ExperienceCard;
