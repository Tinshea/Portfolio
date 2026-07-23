import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Divider } from '@mui/material';
import { Star as StarIcon, ForkRight as ForkRightIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ProjectCardProps } from '@/types';
import { handleBannerError, repoBannerUrl } from '@/lib/banner';

export default function ProjectCard({ user, name, description, stargazerCount, forkCount }: Readonly<ProjectCardProps>) {
    const theme = useTheme();

    const handleCardClick = () => {
        window.open(`https://github.com/${user}/${name}`, "_blank");
    };

    return (
        <Card
            sx={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.03)',
                },
            }}
        >
            <CardActionArea onClick={handleCardClick}>
                <CardMedia
                    component="img"
                    height="140"
                    // Committed banner.{jpg,png} on main/master, else GitHub's
                    // OpenGraph render — see repoBannerCandidates in @/lib/banner.
                    image={repoBannerUrl(user, name)}
                    alt={name}
                    sx={{
                        objectFit: 'cover',
                    }}
                    onError={(e) => handleBannerError(e, user, name)}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h4" textAlign="center" height={40} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" overflow={"hidden"} height={80}>
                        {description || "No description provided."}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <StarIcon sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                                {stargazerCount}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ForkRightIcon sx={{ ml: 2, mr: 0.5, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                                {forkCount}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
