import React, { useState, useMemo } from "react";
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip, Container, Fade, TextField, Paper, InputAdornment } from "@mui/material";
import { Visibility, Search as SearchIcon, FilterList as FilterIcon, Public as PublicIcon } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import useSWR from "swr";
import { useAuth } from "../contexts/auth";
import { useThemeMode } from "../contexts/Theme.context";
import * as api from "../api";
import AsyncData from "../components/AsyncData";
import Navbar from "../components/Navbar";
import { formatCardCount, getCardStyles } from "../constants";

const FolderCard = ({ folder, onStudy, onViewDetails }) => {
  const { darkMode } = useThemeMode();

  return (
    <Fade
      in
      timeout={300}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          ...getCardStyles(darkMode),
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            ...getCardStyles(darkMode)["&:hover"],
            boxShadow: darkMode ? "0 12px 40px rgba(0, 210, 255, 0.2), 0 0 30px rgba(118, 75, 162, 0.3)" : "0 12px 40px rgba(21, 101, 192, 0.15), 0 0 30px rgba(21, 101, 192, 0.1)",
            border: darkMode ? "1px solid rgba(0, 210, 255, 0.4)" : "1px solid rgba(21, 101, 192, 0.5)",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            mb={2}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {folder.name}
            </Typography>
            <Chip
              icon={<Visibility />}
              label="Public"
              size="small"
              color="success"
              sx={{
                borderRadius: "8px",
                fontWeight: "medium",
              }}
            />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {formatCardCount(folder.card_count || 0)}
          </Typography>
          {folder.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {folder.description}
            </Typography>
          )}
          {folder.user_email && (
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Created by: {folder.user_email}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            size="small"
            onClick={() => onStudy(folder)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            Study
          </Button>
          <Button
            size="small"
            onClick={() => onViewDetails(folder)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Fade>
  );
};

const PublicFolders = () => {
  const { isAuthed } = useAuth();
  const { darkMode } = useThemeMode();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: folders, isLoading, error } = useSWR("folders", api.getPublic);

  const filteredFolders = useMemo(() => {
    if (!folders) return [];

    return folders.filter((folder) => {
      const isPublic = folder.public_boolean;
      const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase());

      return isPublic && matchesSearch;
    });
  }, [folders, searchTerm]);

  const handleStudy = (folder) => {
    navigate(`/folders/${folder.id}/study`);
  };

  const handleViewDetails = (folder) => {
    navigate(`/folders/${folder.id}`);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #764ba2 70%, #667eea 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ py: 4 }}
        >
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  background: darkMode
                    ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"
                    : "linear-gradient(45deg, #1565c0 0%, #1976d2 25%, #1e88e5 50%, #2196f3 75%, #42a5f5 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textShadow: darkMode ? "0 0 30px rgba(0, 210, 255, 0.3)" : "0 2px 4px rgba(21, 101, 192, 0.3)",
                }}
              >
                Community Folders
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#1565c0",
                fontWeight: "500",
              }}
            >
              Browse and study from publicly available folders created by the community
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                ...getCardStyles(darkMode),
                borderRadius: "16px",
                mb: 3,
                backdropFilter: "blur(20px)",
                boxShadow: darkMode ? "0 8px 32px rgba(0, 210, 255, 0.1), 0 0 60px rgba(118, 75, 162, 0.2)" : "0 8px 32px rgba(21, 101, 192, 0.15), 0 4px 20px rgba(25, 118, 210, 0.1)",
              }}
            >
              <Grid
                container
                spacing={3}
                alignItems="center"
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: darkMode ? "#00d2ff" : "#1565c0" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        background: darkMode
                          ? "linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(58, 123, 213, 0.1) 50%, rgba(240, 147, 251, 0.1) 100%)"
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.7) 100%)",
                        backdropFilter: "blur(15px)",
                        color: darkMode ? "#fff" : "#1565c0",
                        "& fieldset": {
                          borderColor: darkMode ? "rgba(0, 210, 255, 0.3)" : "rgba(21, 101, 192, 0.4)",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "rgba(0, 210, 255, 0.5)" : "rgba(21, 101, 192, 0.6)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#00d2ff" : "#1565c0",
                          borderWidth: "2px",
                        },
                        "& input": {
                          color: darkMode ? "#fff" : "#1565c0",
                          fontWeight: "500",
                          "&::placeholder": {
                            color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(21, 101, 192, 0.7)",
                            opacity: 1,
                          },
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
              {searchTerm && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    Showing {filteredFolders.length} folders
                    {searchTerm && ` matching "${searchTerm}"`}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          <AsyncData
            loading={isLoading}
            error={error}
          >
            {folders && folders.length > 0 ? (
              filteredFolders.length > 0 ? (
                <Grid
                  container
                  spacing={3}
                >
                  {filteredFolders.map((folder) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={folder.id}
                    >
                      <FolderCard
                        folder={folder}
                        onStudy={handleStudy}
                        onViewDetails={handleViewDetails}
                        isPublicView={true}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)" }}
                  >
                    {searchTerm ? "No folders match your criteria" : "No community folders found"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {searchTerm ? "Try adjusting your search criteria to find more folders." : "There are no community folders available at the moment."}
                  </Typography>
                  {searchTerm && (
                    <Button
                      variant="outlined"
                      onClick={() => setSearchTerm("")}
                      sx={{
                        borderRadius: "12px",
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: "medium",
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
                        color: darkMode ? "#fff" : "#fff",
                        "&:hover": {
                          borderColor: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.7)",
                          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      Clear Search
                    </Button>
                  )}
                </Box>
              )
            ) : (
              <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)" }}
                >
                  No community folders found
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  There are no community folders available at the moment.
                </Typography>
                {!isAuthed && (
                  <Button
                    variant="contained"
                    component={Link}
                    to="/login"
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: "bold",
                      background: darkMode ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(45deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
                      "&:hover": {
                        background: darkMode ? "linear-gradient(45deg, #00b8e6 0%, #3069c2 50%, #e080e8 100%)" : "linear-gradient(45deg, #1349a0 0%, #1764c2 50%, #1e88e5 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: darkMode ? "0 8px 25px rgba(0, 210, 255, 0.3)" : "0 8px 25px rgba(21, 101, 192, 0.3)",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: darkMode ? "0 4px 20px rgba(0, 210, 255, 0.3)" : "0 4px 20px rgba(21, 101, 192, 0.3)",
                    }}
                  >
                    Join to Create Folders
                  </Button>
                )}
              </Box>
            )}
          </AsyncData>
        </Container>
      </Box>
    </>
  );
};

export default PublicFolders;
