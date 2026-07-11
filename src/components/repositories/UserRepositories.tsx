import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import {
  List,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Box,
  useTheme,
  ListItemButton,
  Avatar,
  Grid,
  CircularProgress,
} from '@mui/material';
import useIsMobile from '@/hooks/useIsMobile';
import { Star as StarIcon, ForkRight as ForkRightIcon } from '@mui/icons-material';
import ProfileCard from './ProfileCard';
import { Repo } from '@/types';

const RepositoryItem: React.FC<{ repo: Repo }> = ({ repo }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <React.Fragment>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }}
        transition={{ duration: 0.5 }}
      >
        <ListItemButton
          onClick={() => window.open(repo.html_url, '_blank')}
          sx={{
            borderRadius: 1,
            mb: isMobile ? 1 : 2,
            mt: isMobile ? 1 : 2,
            p: isMobile ? 1 : 2,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ListItemIcon>
            <Avatar
              alt="GitHub"
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              sx={{ width: isMobile ? 24 : 40, height: isMobile ? 24 : 40 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontSize: isMobile ? '0.875rem' : '1rem' }}
              >
                {repo.name}
              </Typography>
            }
            secondaryTypographyProps={{ component: "div" }}
            secondary={
              <Box sx={{ mt: 0.5 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                >
                  {repo.description || 'No description available.'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <StarIcon sx={{ color: theme.palette.warning.main, fontSize: isMobile ? 16 : 20, mr: 0.5 }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      {repo.stargazers_count}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ForkRightIcon sx={{ color: theme.palette.info.main, fontSize: isMobile ? 16 : 20, mr: 0.5 }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      {repo.forks_count}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            }
          />
        </ListItemButton>
      </motion.div>
      <Divider />
    </React.Fragment>
  );
};

const UserRepositories: React.FC<{ username: string }> = ({ username }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then((response) => response.json())
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching repositories:', error);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

  return (
    <Box sx={{ p: isMobile ? 4 : 8, maxWidth: "1900px", margin: 'auto', textAlign: 'center' }}>
      {isMobile && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <ProfileCard
            username={username}
            profilePicture={`https://avatars.githubusercontent.com/${username}`}
            forks={totalForks}
            favorites={totalStars}
          />
        </Box>
      )}
      <Grid container spacing={2} justifyContent="center">
        {!isMobile && (
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: isMobile ? 56 : 80, maxWidth: "600px", margin: 'auto', display: 'flex', justifyContent: 'center' }}>
              <ProfileCard
                username={username}
                profilePicture={`https://avatars.githubusercontent.com/${username}`}
                forks={totalForks}
                favorites={totalStars}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={8}>
          <List sx={{ maxWidth: "1250px", margin: 'auto' }}>
            {repos.map((repo) => (
              <RepositoryItem key={repo.id} repo={repo} />
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserRepositories;
