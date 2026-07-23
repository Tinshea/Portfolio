import React, { useEffect, useState } from 'react';
import {
  List,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Box,
  useTheme,
  ListItemButton,
  Grid,
  Skeleton,
} from '@mui/material';
import useIsMobile from '@/hooks/useIsMobile';
import { Star as StarIcon, ForkRight as ForkRightIcon } from '@mui/icons-material';
import ProfileCard from './ProfileCard';
import { Repo } from '@/types';
import { handleBannerError, repoBannerUrl } from '@/lib/banner';

const RepositoryItem: React.FC<{ repo: Repo; username: string }> = ({ repo, username }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <React.Fragment>
      <div>
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
          <ListItemIcon sx={{ minWidth: 0, mr: isMobile ? 1.5 : 2 }}>
            <Box
              component="img"
              // Repo banner.{jpg,png} with OpenGraph fallback — @/lib/banner.
              src={repoBannerUrl(username, repo.name)}
              onError={(e) => handleBannerError(e, username, repo.name)}
              alt={`${repo.name} preview`}
              sx={{
                width: isMobile ? 72 : 120,
                aspectRatio: '2 / 1',
                objectFit: 'cover',
                borderRadius: 1,
                flexShrink: 0,
                bgcolor: theme.palette.action.hover,
              }}
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
                    <StarIcon sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? 16 : 20, mr: 0.5 }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      {repo.stargazers_count}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ForkRightIcon sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? 16 : 20, mr: 0.5 }} />
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
      </div>
      <Divider />
    </React.Fragment>
  );
};

const UserRepositories: React.FC<{ username: string }> = ({ username }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
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
    // Skeletons match the final list layout instead of a generic spinner.
    return (
      <Box sx={{ p: isMobile ? 4 : 8, maxWidth: "1250px", margin: "auto" }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={72} sx={{ mb: 2 }} />
        ))}
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
            {repos.map((repo, index) => (
              <Box
                key={repo.id}
                sx={{
                  "@media (prefers-reduced-motion: no-preference)": {
                    animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
                    animationDelay: `${Math.min(index, 8) * 60}ms`,
                  },
                }}
              >
                <RepositoryItem repo={repo} username={username} />
              </Box>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserRepositories;
