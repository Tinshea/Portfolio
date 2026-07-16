import React from "react";
import { Star as StarIcon, ForkRight as ForkRightIcon } from "@mui/icons-material";
import { Avatar, Box, Card, CardActionArea, CardContent, Typography, useTheme, Divider } from "@mui/material";
import useIsMobile from "@/hooks/useIsMobile";

type ProfileCardProps = {
  username: string;
  profilePicture: string;
  forks: number;
  favorites: number;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ username, profilePicture, forks, favorites }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Card
      sx={{
        width: { xs: "90%", sm: "80%", md: "75%" },
        backgroundColor: theme.palette.background.paper,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <CardActionArea onClick={() => window.open(`https://github.com/${username}`, "_blank")}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          textAlign: "center",
        }}
      >
        {
          isMobile ? (
            <>
              <Avatar
                alt={username}
                src={profilePicture}
                sx={{
                  width: { xs: 60, sm: 75, md: 90 },
                  height: { xs: 60, sm: 75, md: 90 },
                  border: `3px solid ${theme.palette.primary.main}`,
                  margin: "0 auto",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    color: theme.palette.text.primary,
                    textAlign: "center", // Centre le texte
                    wordWrap: "break-word", // Coupe les mots longs si nécessaire
                    overflowWrap: "break-word", // Alternative pour les mots longs
                  }}
                >
                  {username}
                </Typography>
              </div>
            </>
            ) : 
            (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: "100%" }}>
                <Avatar
                  alt={username}
                  src={profilePicture}
                  sx={{
                    width: { xs: 60, sm: 75, md: 90 },
                    height: { xs: 60, sm: 75, md: 90 },
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    alt="GitHub"
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    sx={{
                      width: { xs: 20, sm: 32 },
                      height: { xs: 20, sm: 32 },
                      marginBottom: "4px",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      color: theme.palette.text.primary,
                      textAlign: "center", // Centre le texte
                      wordWrap: "break-word", // Coupe les mots longs si nécessaire
                      overflowWrap: "break-word", // Alternative pour les mots longs
                    }}
                  >
                    {username}
                  </Typography>
                </div>
              </Box>
            )
        }
        <Divider sx={{ width: "100%"}} />
        <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <StarIcon sx={{ color: theme.palette.text.secondary, fontSize: { xs: 20, sm: 22 } }} />
            <Typography
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                color: theme.palette.text.secondary,
              }}
            >
              {favorites}
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ForkRightIcon sx={{ color: theme.palette.text.secondary, fontSize: { xs: 20, sm: 22 } }} />
            <Typography
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                color: theme.palette.text.secondary,
              }}
            >
              {forks}
            </Typography>
          </div>
        </div>
      </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProfileCard;
