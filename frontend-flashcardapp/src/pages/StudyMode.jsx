import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Paper, Container } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Close as CloseIcon, Visibility, VisibilityOff, School as StudyIcon } from "@mui/icons-material";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import useSWR from "swr";
import { useAuth } from "../contexts/auth";
import { useThemeMode } from "../contexts/Theme.context";
import * as api from "../api";
import AsyncData from "../components/AsyncData";
import Navbar from "../components/Navbar";
import { shuffleArray } from "../constants";

const StudyMode = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed } = useAuth();
  const { darkMode } = useThemeMode();

  const searchParams = new URLSearchParams(location.search);
  const isPublicFolder = searchParams.get("public") === "true";

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);

  const [folderFromPublic, setFolderFromPublic] = useState(null);
  const [cardsFromPublic, setCardsFromPublic] = useState([]);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);

  const folderEndpoint = isAuthed && !isPublicFolder ? `users/folders/${folderId}` : null;
  const cardsEndpoint = isAuthed && !isPublicFolder ? `users/folders/${folderId}/cards` : null;

  const { data: folderData, error: folderError, isLoading: folderLoading } = useSWR(folderEndpoint, api.getById);

  const { data: cardsData, error: cardsError, isLoading: cardsLoading } = useSWR(cardsEndpoint, api.getById);

  useEffect(() => {
    if ((!isAuthed || isPublicFolder) && folderId) {
      setIsLoadingPublic(true);
      api
        .getById("folders")
        .then((publicFolders) => {
          if (Array.isArray(publicFolders)) {
            const targetFolder = publicFolders.find((f) => f.id === parseInt(folderId) && f.public_boolean);
            if (targetFolder) {
              setFolderFromPublic(targetFolder);
              return api.getById(`folders/${folderId}/cards`).catch(() => []);
            }
          }
          return [];
        })
        .then((cards) => {
          setCardsFromPublic(Array.isArray(cards) ? cards : []);
        })
        .catch((error) => {
          console.error("Error fetching public folder data:", error);
          setFolderFromPublic(null);
          setCardsFromPublic([]);
        })
        .finally(() => {
          setIsLoadingPublic(false);
        });
    }
  }, [isAuthed, folderId, isPublicFolder]);

  const folder = isAuthed && !isPublicFolder ? folderData : folderFromPublic;

  const cards = useMemo(() => {
    if (isAuthed && !isPublicFolder) {
      return Array.isArray(cardsData) ? cardsData : [];
    }
    return cardsFromPublic;
  }, [cardsData, cardsFromPublic, isAuthed, isPublicFolder]);

  useEffect(() => {
    if (cards && cards.length > 0) {
      const shuffled = shuffleArray([...cards]);
      setShuffledCards(shuffled);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  }, [cards]);

  useEffect(() => {
    if (folder && !isAuthed && !folder.public_boolean) {
      navigate("/login");
    }
  }, [folder, isAuthed, navigate]);

  const currentCard = shuffledCards[currentCardIndex];

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

  const resetStudy = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    if (cards && cards.length > 0) {
      const shuffled = shuffleArray([...cards]);
      setShuffledCards(shuffled);
    }
  };

  const goToFolderDetail = () => {
    const queryString = isPublicFolder ? "?public=true" : "";
    navigate(`/folders/${folderId}${queryString}`);
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
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <AsyncData
            loading={isAuthed ? folderLoading || cardsLoading : isLoadingPublic}
            error={folderError || cardsError}
          >
            {folder && (
              <>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    p: 3,
                    background: darkMode
                      ? "linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(58, 123, 213, 0.1) 50%, rgba(240, 147, 251, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.7) 100%)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "20px",
                    border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.3)",
                    boxShadow: darkMode ? "0 8px 30px rgba(0, 210, 255, 0.1)" : "0 8px 30px rgba(21, 101, 192, 0.1)",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        color: darkMode ? "#00d2ff" : "#1565c0",
                        mb: 1,
                      }}
                    >
                      <StudyIcon sx={{ mr: 1, verticalAlign: "middle", color: darkMode ? "#00d2ff" : "#1565c0" }} />
                      Studying: {folder.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Chip
                        icon={folder.public_boolean ? <Visibility /> : <VisibilityOff />}
                        label={folder.public_boolean ? "Public" : "Private"}
                        size="small"
                        color={folder.public_boolean ? "success" : "default"}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(21, 101, 192, 0.8)" }}
                      >
                        {shuffledCards.length > 0 ? `${currentCardIndex + 1} of ${shuffledCards.length} cards` : "No cards"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={resetStudy}
                      disabled={shuffledCards.length === 0}
                      sx={{
                        borderColor: darkMode ? "#00d2ff" : "#1565c0",
                        color: darkMode ? "#00d2ff" : "#1565c0",
                      }}
                    >
                      Shuffle & Restart
                    </Button>
                    <Button
                      variant="contained"
                      onClick={goToFolderDetail}
                      sx={{
                        background: darkMode ? "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)" : "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                      }}
                    >
                      View All Cards
                    </Button>
                  </Box>
                </Box>

                {/* Study Interface */}
                {shuffledCards.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "500px",
                      gap: 3,
                    }}
                  >
                    {/* Previous Button */}
                    <Button
                      variant="contained"
                      onClick={prevCard}
                      disabled={currentCardIndex === 0}
                      sx={{
                        minWidth: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background:
                          currentCardIndex === 0
                            ? darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)"
                            : darkMode
                              ? "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)"
                              : "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                        color: currentCardIndex === 0 ? (darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)") : "#ffffff",
                        border: "none",
                        boxShadow:
                          currentCardIndex === 0
                            ? "none"
                            : darkMode
                              ? "0 4px 15px rgba(0, 210, 255, 0.3), 0 0 20px rgba(58, 123, 213, 0.2)"
                              : "0 4px 15px rgba(21, 101, 192, 0.3), 0 0 20px rgba(25, 118, 210, 0.2)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background:
                            currentCardIndex === 0
                              ? darkMode
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.1)"
                              : darkMode
                                ? "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)"
                                : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                          transform: currentCardIndex === 0 ? "none" : "translateY(-2px) scale(1.05)",
                          boxShadow:
                            currentCardIndex === 0
                              ? "none"
                              : darkMode
                                ? "0 6px 20px rgba(0, 210, 255, 0.4), 0 0 30px rgba(58, 123, 213, 0.3)"
                                : "0 6px 20px rgba(21, 101, 192, 0.4), 0 0 30px rgba(25, 118, 210, 0.3)",
                        },
                        "&:disabled": {
                          background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                          color: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <ArrowBackIos />
                    </Button>

                    {/* Card Container */}
                    <Box
                      onClick={flipCard}
                      sx={{
                        width: "100%",
                        maxWidth: "600px",
                        height: "400px",
                        perspective: "1000px",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transition: "transform 0.6s ease-in-out",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* Front of card (Question) */}
                        <Paper
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 4,
                            background: darkMode
                              ? "linear-gradient(135deg, rgba(0, 210, 255, 0.15) 0%, rgba(58, 123, 213, 0.15) 50%, rgba(240, 147, 251, 0.1) 100%)"
                              : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.9) 50%, rgba(187, 222, 251, 0.8) 100%)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "20px",
                            border: darkMode ? "2px solid rgba(0, 210, 255, 0.3)" : "2px solid rgba(21, 101, 192, 0.4)",
                            boxShadow: darkMode ? "0 12px 40px rgba(0, 210, 255, 0.2)" : "0 12px 40px rgba(21, 101, 192, 0.15)",
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "600",
                                color: darkMode ? "#fff" : "#1565c0",
                                mb: 2,
                                lineHeight: 1.4,
                              }}
                            >
                              {currentCard?.front}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(21, 101, 192, 0.7)",
                                fontStyle: "italic",
                              }}
                            >
                              Click to reveal answer
                            </Typography>
                          </Box>
                        </Paper>

                        {/* Back of card (Answer) */}
                        <Paper
                          elevation={3}
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 4,
                            backgroundColor: darkMode
                              ? "linear-gradient(135deg, rgba(0, 210, 255, 0.15) 0%, rgba(58, 123, 213, 0.15) 50%, rgba(240, 147, 251, 0.1) 100%)"
                              : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.9) 50%, rgba(187, 222, 251, 0.8) 100%)",
                            borderRadius: "20px",
                            border: `2px solid ${darkMode ? "#4caf50" : "#2e7d32"}`,
                          }}
                        >
                          <Box
                            sx={{
                              textAlign: "center",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "600",
                                color: darkMode ? "#ffffff" : "#2e7d32",
                                mb: 2,
                                lineHeight: 1.4,
                                wordBreak: "break-word",
                                hyphens: "auto",
                              }}
                            >
                              {currentCard?.back}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: darkMode ? "#bbbbbb" : "#4caf50",
                                fontStyle: "italic",
                                opacity: 0.8,
                              }}
                            >
                              Click to flip back
                            </Typography>
                          </Box>
                        </Paper>
                      </Box>
                    </Box>

                    {/* Next Button */}
                    <Button
                      variant="contained"
                      onClick={nextCard}
                      disabled={currentCardIndex === shuffledCards.length - 1}
                      sx={{
                        minWidth: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background:
                          currentCardIndex === shuffledCards.length - 1
                            ? darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)"
                            : darkMode
                              ? "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)"
                              : "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                        color: currentCardIndex === shuffledCards.length - 1 ? (darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)") : "#ffffff",
                        border: "none",
                        boxShadow:
                          currentCardIndex === shuffledCards.length - 1
                            ? "none"
                            : darkMode
                              ? "0 4px 15px rgba(0, 210, 255, 0.3), 0 0 20px rgba(58, 123, 213, 0.2)"
                              : "0 4px 15px rgba(21, 101, 192, 0.3), 0 0 20px rgba(25, 118, 210, 0.2)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background:
                            currentCardIndex === shuffledCards.length - 1
                              ? darkMode
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.1)"
                              : darkMode
                                ? "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)"
                                : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                          transform: currentCardIndex === shuffledCards.length - 1 ? "none" : "translateY(-2px) scale(1.05)",
                          boxShadow:
                            currentCardIndex === shuffledCards.length - 1
                              ? "none"
                              : darkMode
                                ? "0 6px 20px rgba(0, 210, 255, 0.4), 0 0 30px rgba(58, 123, 213, 0.3)"
                                : "0 6px 20px rgba(21, 101, 192, 0.4), 0 0 30px rgba(25, 118, 210, 0.3)",
                        },
                        "&:disabled": {
                          background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                          color: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <ArrowForwardIos />
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 8,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ color: darkMode ? "#fff" : "#1565c0" }}
                    >
                      📚 No Cards Available
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(21, 101, 192, 0.8)",
                      }}
                    >
                      This folder doesn&apos;t have any cards to study yet.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={goToFolderDetail}
                      sx={{
                        background: darkMode ? "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)" : "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                      }}
                    >
                      Back to Folder
                    </Button>
                  </Box>
                )}

                {/* Progress and controls */}
                {shuffledCards.length > 0 && (
                  <Box
                    sx={{
                      mt: 4,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(21, 101, 192, 0.8)",
                      }}
                    >
                      Progress: {Math.round(((currentCardIndex + 1) / shuffledCards.length) * 100)}%
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
                        height: "8px",
                        background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(21, 101, 192, 0.1)",
                        borderRadius: "4px",
                        overflow: "hidden",
                        mx: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${((currentCardIndex + 1) / shuffledCards.length) * 100}%`,
                          background: darkMode ? "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(90deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </>
            )}
          </AsyncData>
        </Container>
      </Box>
    </>
  );
};

export default StudyMode;
