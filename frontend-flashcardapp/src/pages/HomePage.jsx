import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Alert,
  Container,
  Paper,
  Avatar,
  IconButton,
  Divider,
  Fade,
  Slide,
} from "@mui/material";
import { Add as AddIcon, Visibility, VisibilityOff, ArrowBackIos, ArrowForwardIos, School, Psychology, Speed, Groups, AutoStories, KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import useSWR from "swr";
import { useAuth } from "../contexts/auth";
import * as api from "../api";
import AsyncData from "../components/AsyncData";
import Navbar from "../components/Navbar";
import { APP_CONSTANTS, formatCardCount, getScoreColor, getScoreLabel, shuffleArray, gradients } from "../constants";

const FolderCard = ({ folder, onStudy }) => {
  const { isAuthed } = useAuth();
  const [cardCount, setCardCount] = useState(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  useEffect(() => {
    const fetchCardCount = async () => {
      setIsLoadingCount(true);
      try {
        const endpoint = isAuthed && folder.user_id ? `users/folders/${folder.id}/cards` : `folders/${folder.id}/cards`;
        const cardsResponse = await api.getById(endpoint);
        const cards = Array.isArray(cardsResponse) ? cardsResponse : [];
        setCardCount(cards.length);
      } catch (error) {
        console.error("Error loading card count:", error);
        setCardCount(0);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchCardCount();
  }, [folder.id, isAuthed, folder.user_id]);

  const displayCardCount = () => {
    if (isLoadingCount) return "Loading...";
    if (cardCount !== null) return formatCardCount(cardCount);
    return formatCardCount(folder.card_count || 0);
  };
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          mb={1}
        >
          <Typography
            variant="h6"
            component="h2"
          >
            {folder.name}
          </Typography>
          <Chip
            icon={folder.public_boolean ? <Visibility /> : <VisibilityOff />}
            label={folder.public_boolean ? "Public" : "Private"}
            size="small"
            color={folder.public_boolean ? "success" : "default"}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {displayCardCount()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => onStudy(folder)}
        >
          Study
        </Button>
        <Button
          size="small"
          component={Link}
          to={`/folders/${folder.id}`}
        >
          View
        </Button>
        {folder.user_id && (
          <Button
            size="small"
            component={Link}
            to={`/folders/${folder.id}/cards/create`}
          >
            Add Card
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const StudyDialog = ({ open, onClose, folder, cards }) => {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    if (open && cards && cards.length > 0) {
      const shuffled = shuffleArray(cards);
      setShuffledCards(shuffled);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  }, [open, cards]);

  const currentCard = shuffledCards?.[currentCardIndex];

  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      if (isFlipped) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex((prev) => prev + 1);
        }, 300);
      } else {
        setCurrentCardIndex((prev) => prev + 1);
      }
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      if (isFlipped) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex((prev) => prev - 1);
        }, 300);
      } else {
        setCurrentCardIndex((prev) => prev - 1);
      }
    }
  };

  const flipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleScore = async (score) => {
    if (!user || !currentCard) return;

    try {
      await api.axios.post(`users/folders/${folder.id}/cards/${currentCard.id}/scores`, { score });
      nextCard();
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (!shuffledCards || shuffledCards.length === 0) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Study - {folder?.name}</DialogTitle>
        <DialogContent>
          <Alert severity="info">No cards available in this folder.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        Study - {folder?.name} ({currentCardIndex + 1}/{shuffledCards.length})
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "400px",
            gap: 2,
          }}
        >
          {/* Previous Button */}
          <Button
            variant="outlined"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            sx={{
              minWidth: "60px",
              height: "60px",
              borderRadius: "50%",
            }}
          >
            <ArrowBackIos />
          </Button>

          {/* Card Container */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              onClick={flipCard}
              className="study-card"
              sx={{
                width: "100%",
                maxWidth: "500px",
                height: "300px",
                perspective: "1000px",
                cursor: "pointer",
              }}
            >
              <Box
                className="card-flip-container"
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s ease-in-out",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front of card */}
                <Box
                  className="card-face"
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    border: 3,
                    borderColor: "primary.main",
                    borderRadius: 3,
                    boxShadow: 4,
                    p: 3,
                    backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {currentCard?.front}
                    </Typography>
                  </Box>
                </Box>

                {/* Back of card */}
                <Box
                  className="card-face"
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "secondary.light",
                    color: "secondary.contrastText",
                    border: 3,
                    borderColor: "secondary.main",
                    borderRadius: 3,
                    boxShadow: 4,
                    p: 3,
                    backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {currentCard?.back}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Next Button */}
          <Button
            variant="outlined"
            onClick={nextCard}
            disabled={currentCardIndex === shuffledCards.length - 1}
            sx={{
              minWidth: "60px",
              height: "60px",
              borderRadius: "50%",
            }}
          >
            <ArrowForwardIos />
          </Button>
        </Box>

        {/* Score buttons (only show when answer is visible and user is logged in) */}
        {isFlipped && user && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              color={getScoreColor(APP_CONSTANTS.SCORE_LEVELS.HARD)}
              onClick={() => handleScore(APP_CONSTANTS.SCORE_LEVELS.HARD)}
            >
              {getScoreLabel(APP_CONSTANTS.SCORE_LEVELS.HARD)} ({APP_CONSTANTS.SCORE_LEVELS.HARD})
            </Button>
            <Button
              variant="outlined"
              color={getScoreColor(APP_CONSTANTS.SCORE_LEVELS.MEDIUM)}
              onClick={() => handleScore(APP_CONSTANTS.SCORE_LEVELS.MEDIUM)}
            >
              {getScoreLabel(APP_CONSTANTS.SCORE_LEVELS.MEDIUM)} ({APP_CONSTANTS.SCORE_LEVELS.MEDIUM})
            </Button>
            <Button
              variant="outlined"
              color={getScoreColor(APP_CONSTANTS.SCORE_LEVELS.EASY)}
              onClick={() => handleScore(APP_CONSTANTS.SCORE_LEVELS.EASY)}
            >
              {getScoreLabel(APP_CONSTANTS.SCORE_LEVELS.EASY)} ({APP_CONSTANTS.SCORE_LEVELS.EASY})
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const HomePage = () => {
  const { user, isAuthed } = useAuth();
  const navigate = useNavigate();
  const [studyFolder, setStudyFolder] = useState(null);
  const [studyCards, setStudyCards] = useState([]);
  const [showFolders, setShowFolders] = useState(false);

  const { data: folders, error: foldersError, isLoading: foldersLoading } = useSWR(isAuthed ? "users/folders" : "folders", api.getById);

  const handleStudy = async (folder) => {
    try {
      const endpoint = isAuthed && folder.user_id ? `users/folders/${folder.id}/cards` : `folders/${folder.id}/cards`;
      const cardsResponse = await api.getById(endpoint);
      const cards = Array.isArray(cardsResponse) ? cardsResponse : [];
      setStudyCards(cards);
      setStudyFolder(folder);
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const features = [
    {
      icon: <School sx={{ fontSize: 48 }} />,
      title: "Smart Learning",
      description: "Create and study flashcards with an intelligent learning system that adapts to your progress.",
    },
    {
      icon: <Psychology sx={{ fontSize: 48 }} />,
      title: "Memory Enhancement",
      description: "Use proven spaced repetition techniques to improve long-term memory retention.",
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: "Fast & Efficient",
      description: "Quick card creation and streamlined study sessions to maximize your learning time.",
    },
    {
      icon: <Groups sx={{ fontSize: 48 }} />,
      title: "Collaborative",
      description: "Share your study sets with others and access public flashcard collections.",
    },
    {
      icon: <AutoStories sx={{ fontSize: 48 }} />,
      title: "Organized Study",
      description: "Organize your flashcards into folders and categories for structured learning.",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      {/* Hero Section */}
      <Box
        sx={{
          background: gradients.primary,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          width: "100%",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            animation: "float 6s ease-in-out infinite",
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Fade
            in
            timeout={1500}
          >
            <Box textAlign="center">
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  mb: 3,
                  background: "linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  animation: "glow 2s ease-in-out infinite alternate",
                }}
              >
                Welcome to FlipWise
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { xs: "1.2rem", md: "1.8rem" },
                  textShadow: "0 1px 5px rgba(0,0,0,0.3)",
                  animation: "slideInFromBottom 1s ease-out 0.5s both",
                }}
              >
                Master any subject with intelligent flashcards
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 6,
                  opacity: 0.9,
                  maxWidth: 700,
                  mx: "auto",
                  fontSize: "1.2rem",
                  lineHeight: 1.6,
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  animation: "slideInFromBottom 1s ease-out 0.8s both",
                }}
              >
                Create, study, and share flashcards with our powerful learning platform. Boost your memory and achieve your learning goals faster than ever before!
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  animation: "slideInFromBottom 1s ease-out 1.1s both",
                }}
              >
                {!isAuthed ? (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/register")}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        fontWeight: "bold",
                        px: 5,
                        py: 2,
                        fontSize: "1.2rem",
                        borderRadius: "50px",
                        borderWidth: "2px",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          transform: "translateY(-3px) scale(1.05)",
                          boxShadow: "0 12px 30px rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/login")}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        fontWeight: "bold",
                        px: 5,
                        py: 2,
                        fontSize: "1.2rem",
                        borderRadius: "50px",
                        borderWidth: "2px",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          transform: "translateY(-3px) scale(1.05)",
                          boxShadow: "0 12px 30px rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/about")}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        fontWeight: "bold",
                        px: 5,
                        py: 2,
                        fontSize: "1.2rem",
                        borderRadius: "50px",
                        borderWidth: "2px",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          transform: "translateY(-3px) scale(1.05)",
                          boxShadow: "0 12px 30px rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/about")}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        fontWeight: "bold",
                        px: 5,
                        py: 2,
                        fontSize: "1.2rem",
                        borderRadius: "50px",
                        borderWidth: "2px",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          transform: "translateY(-3px) scale(1.05)",
                          boxShadow: "0 12px 30px rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Fade>
        </Container>

        {/* Enhanced Scroll indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "bounce 2s infinite",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateX(-50%) scale(1.2)",
              filter: "brightness(1.2)",
            },
          }}
          onClick={scrollToFeatures}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                opacity: 0.8,
                fontWeight: "bold",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Discover More
            </Typography>
            <IconButton
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.5)",
                },
              }}
            >
              <KeyboardArrowDown sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Container
        maxWidth="lg"
        sx={{ py: 8 }}
        id="features-section"
      >
        <Box
          textAlign="center"
          mb={6}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Why Use FlipWise?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Discover the features that make FlipWise the perfect learning companion
          </Typography>
        </Box>

        <Grid
          container
          spacing={4}
          justifyContent="center"
        >
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={index === 2 || index === 3 ? 6 : 4}
              key={index}
              sx={index === 2 || index === 3 ? { display: "flex", justifyContent: "center" } : {}}
            >
              <Slide
                direction="up"
                in
                timeout={500 + index * 200}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    height: "100%",
                    textAlign: "center",
                    borderRadius: "20px",
                    background: (theme) => (theme.palette.mode === "dark" ? "linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)" : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)"),
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-10px) scale(1.02)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      "&::before": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Avatar
                    data-cy="avatar-menu"
                    sx={{
                      background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                      width: 90,
                      height: 90,
                      mx: "auto",
                      mb: 3,
                      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "rotate(10deg) scale(1.1)",
                        boxShadow: "0 12px 30px rgba(102, 126, 234, 0.4)",
                      },
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: "1rem",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* User's Folders Section (only shown when logged in and toggled) */}
      {isAuthed && showFolders && (
        <Container
          maxWidth="lg"
          sx={{ py: 4 }}
        >
          <Divider sx={{ mb: 4 }} />
          <Box
            textAlign="center"
            mb={4}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
            >
              Welcome back, {user?.email?.split("@")[0]}!
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
            >
              Your study folders
            </Typography>
          </Box>

          <AsyncData
            loading={foldersLoading}
            error={foldersError}
          >
            <Grid
              container
              spacing={3}
            >
              {Array.isArray(folders) &&
                folders.map((folder) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={folder.id}
                  >
                    <FolderCard
                      folder={folder}
                      onStudy={handleStudy}
                    />
                  </Grid>
                ))}
            </Grid>

            {(!folders || folders.length === 0) && (
              <Box
                textAlign="center"
                py={8}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                >
                  No folders yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  Create your first folder to get started!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/folders/create")}
                  sx={{ mt: 2 }}
                >
                  Create Folder
                </Button>
              </Box>
            )}
          </AsyncData>
        </Container>
      )}

      <StudyDialog
        open={!!studyFolder}
        onClose={() => setStudyFolder(null)}
        folder={studyFolder}
        cards={studyCards}
      />
    </Box>
  );
};

export default HomePage;
