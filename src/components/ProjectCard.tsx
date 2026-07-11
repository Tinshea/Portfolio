import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Divider } from '@mui/material';
import { Star as StarIcon, ForkRight as ForkRightIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ProjectCardProps } from '@/types';

export default function ProjectCard({ user, name, description, stargazerCount, forkCount }: Readonly<ProjectCardProps>) {
    const theme = useTheme();

    const handleCardClick = (repoName: string) => {
        window.open(`https://github.com/${user}/${name}`, "_blank");
    };
    
    return (
        <Card
            sx={{
                borderRadius: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: theme.palette.background.paper,
                boxShadow: `1px 1px 1px rgba(0, 0, 0, 0.2)`,
                '&:hover': {
                    transform: 'scale(1.03)',
                },
                opacity: 0.99,
            }}
        >
            <CardActionArea onClick={() => handleCardClick(name)}>
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://raw.githubusercontent.com/${user}/${name}/main/banner.jpg?raw=true`} 
                    alt={name}
                    sx={{ 
                        objectFit: 'cover',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"; 
                    }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" textAlign="center" height={40} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="justify" overflow={"hidden"} height={80}>
                        {description || "No description provided."}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <StarIcon sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                            <Typography variant="body2" color="text.secondary">
                                {stargazerCount}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ForkRightIcon sx={{ ml: 2, mr: 0.5, color: theme.palette.primary.main }} />
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
