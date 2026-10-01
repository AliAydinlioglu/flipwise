import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Fab,
  Divider,
  Paper,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
  Quiz as QuizIcon,
  LiveHelp as QuestionIcon,
  CheckCircle as AnswerIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { useAuth } from "../contexts/auth";
import { useThemeMode } from "../contexts/Theme.context";
import * as api from "../api";
import AsyncData from "../components/AsyncData";

const FolderDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthed } = useAuth();
  const { darkMode } = useThemeMode();

  const searchParams = new URLSearchParams(location.search);
  const isPublicFolder = searchParams.get("public") === "true";

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

  const CardItem = ({ card }) => {
    const { darkMode } = useThemeMode();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleMenuOpen = (event) => {
      setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };

    const handleEditCard = () => {
      navigate(`/folders/${folderId}/cards/${card.id}/edit`);
      handleMenuClose();
    };

    const handleDeleteCard = () => {
      setDeleteDialogOpen(true);
      handleMenuClose();
    };

    const confirmDeleteCard = async () => {
      try {
        await api.deleteById(`users/folders/${folderId}/cards`, { arg: card.id });
        if (isAuthed) {
          mutate(`users/folders/${folderId}/cards`);
        }
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting card:", error);
        alert("Failed to delete card. Please try again.");
      }
    };

    const cancelDeleteCard = () => {
      setDeleteDialogOpen(false);
    };

    return (
      <>
        <Card
          sx={{
            height: "100%",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Spring animation
            background: darkMode
              ? "linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(118, 75, 162, 0.2) 50%, rgba(102, 126, 234, 0.1) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.6) 100%)",
            backdropFilter: "blur(15px)",
            border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.3)",
            boxShadow: darkMode ? "0 4px 20px rgba(0, 210, 255, 0.1)" : "0 4px 20px rgba(21, 101, 192, 0.1)",
            "&:hover": {
              transform: "translateY(-6px) scale(1.02)",
              boxShadow: darkMode ? "0 12px 40px rgba(0, 210, 255, 0.25), 0 0 30px rgba(118, 75, 162, 0.2)" : "0 12px 40px rgba(21, 101, 192, 0.2), 0 0 30px rgba(21, 101, 192, 0.1)",
            },
          }}
        >
          <CardContent sx={{ p: 3, position: "relative" }}>
            {/* Card Menu Button */}
            {isAuthed && !isPublicFolder && (
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                  "&:hover": {
                    color: darkMode ? "#00d2ff" : "#1565c0",
                    backgroundColor: darkMode ? "rgba(0, 210, 255, 0.1)" : "rgba(21, 101, 192, 0.1)",
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}

            {/* Question Section */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 1,
                }}
              >
                <QuestionIcon
                  sx={{
                    color: darkMode ? "#00d2ff" : "#1565c0",
                    fontSize: "1.2rem",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "700",
                    color: darkMode ? "#00d2ff" : "#1565c0",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Question
                </Typography>
              </Box>
              <Paper
                sx={{
                  p: 2,
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(0, 210, 255, 0.15) 0%, rgba(21, 101, 192, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(227, 242, 253, 0.9) 0%, rgba(187, 222, 251, 0.7) 100%)",
                  border: darkMode ? "1px solid rgba(0, 210, 255, 0.3)" : "1px solid rgba(21, 101, 192, 0.3)",
                  borderRadius: "12px",
                  boxShadow: darkMode ? "0 2px 8px rgba(0, 210, 255, 0.1)" : "0 2px 8px rgba(21, 101, 192, 0.1)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "500",
                    color: darkMode ? "#fff" : "#1a1a1a",
                    lineHeight: 1.6,
                  }}
                >
                  {card.front}
                </Typography>
              </Paper>
            </Box>

            <Divider
              sx={{
                my: 2,
                background: darkMode ? "linear-gradient(90deg, transparent, rgba(0, 210, 255, 0.5), transparent)" : "linear-gradient(90deg, transparent, rgba(21, 101, 192, 0.3), transparent)",
              }}
            />

            {/* Answer Section */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 1,
                }}
              >
                <AnswerIcon
                  sx={{
                    color: darkMode ? "#4caf50" : "#2e7d32",
                    fontSize: "1.2rem",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "700",
                    color: darkMode ? "#4caf50" : "#2e7d32",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Answer
                </Typography>
              </Box>
              <Paper
                sx={{
                  p: 2,
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(46, 125, 50, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(232, 245, 233, 0.9) 0%, rgba(200, 230, 201, 0.7) 100%)",
                  border: darkMode ? "1px solid rgba(76, 175, 80, 0.3)" : "1px solid rgba(46, 125, 50, 0.3)",
                  borderRadius: "12px",
                  boxShadow: darkMode ? "0 2px 8px rgba(76, 175, 80, 0.1)" : "0 2px 8px rgba(46, 125, 50, 0.1)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "500",
                    color: darkMode ? "#fff" : "#1a1a1a",
                    lineHeight: 1.6,
                  }}
                >
                  {card.back}
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* Card Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: darkMode ? "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)" : "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
              backdropFilter: "blur(20px)",
              border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.2)",
              borderRadius: "12px",
              boxShadow: darkMode ? "0 10px 30px rgba(0, 0, 0, 0.3)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem
            onClick={handleEditCard}
            sx={{
              color: darkMode ? "#fff" : "#333",
              "&:hover": {
                backgroundColor: darkMode ? "rgba(0, 210, 255, 0.1)" : "rgba(21, 101, 192, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <EditIcon sx={{ color: darkMode ? "#00d2ff" : "#1565c0" }} />
            </ListItemIcon>
            <ListItemText primary="Edit Card" />
          </MenuItem>
          <MenuItem
            onClick={handleDeleteCard}
            sx={{
              color: darkMode ? "#fff" : "#333",
              "&:hover": {
                backgroundColor: darkMode ? "rgba(255, 107, 107, 0.1)" : "rgba(211, 47, 47, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: darkMode ? "#ff6b6b" : "#d32f2f" }} />
            </ListItemIcon>
            <ListItemText primary="Delete Card" />
          </MenuItem>
        </Menu>

        {/* Themed Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={cancelDeleteCard}
          PaperProps={{
            sx: {
              background: darkMode ? "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)" : "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
              backdropFilter: "blur(20px)",
              border: darkMode ? "1px solid rgba(255, 107, 107, 0.3)" : "1px solid rgba(211, 47, 47, 0.3)",
              borderRadius: "16px",
              boxShadow: darkMode ? "0 20px 40px rgba(0, 0, 0, 0.4)" : "0 20px 40px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: darkMode ? "#ff6b6b" : "#d32f2f",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "1.3rem",
            }}
          >
            Delete Card
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                color: darkMode ? "#fff" : "#333",
                textAlign: "center",
                mb: 2,
                fontSize: "1rem",
              }}
            >
              Are you sure you want to delete this card?
            </Typography>
            <Typography
              sx={{
                color: darkMode ? "#b0b0b0" : "#666",
                textAlign: "center",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              onClick={cancelDeleteCard}
              sx={{
                mr: 2,
                px: 3,
                py: 1,
                background: darkMode
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)"
                  : "linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%)",
                color: darkMode ? "#fff" : "#333",
                border: darkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "12px",
                "&:hover": {
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.15) 100%)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteCard}
              sx={{
                px: 3,
                py: 1,
                background: darkMode ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)" : "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
                color: "#fff",
                borderRadius: "12px",
                "&:hover": {
                  background: darkMode ? "linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)" : "linear-gradient(135deg, #b71c1c 0%, #8e0000 100%)",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <>
      {/* Fixed background layer */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #764ba2 70%, #667eea 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          minHeight: "100vh",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <AsyncData
            loading={isAuthed ? folderLoading : isLoadingPublic}
            error={folderError}
          >
            {folder && (
              <>
                {/* Redirect non-authenticated users if folder is private */}
                {!isAuthed && !folder.public_boolean && (
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
                      🔒 Private Folder
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(21, 101, 192, 0.8)",
                      }}
                    >
                      This folder is private. Please log in to access it.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        component={Link}
                        to="/login"
                        sx={{
                          background: darkMode ? "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)" : "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                        }}
                      >
                        Log In
                      </Button>
                      <Button
                        variant="outlined"
                        component={Link}
                        to="/public-folders"
                        sx={{
                          borderColor: darkMode ? "#00d2ff" : "#1565c0",
                          color: darkMode ? "#00d2ff" : "#1565c0",
                        }}
                      >
                        Browse Public Folders
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Show folder content if authenticated or if folder is public */}
                {(isAuthed || folder.public_boolean) && (
                  <>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Box>
                        <Typography
                          variant="h4"
                          component="h1"
                          gutterBottom
                        >
                          {folder.name}
                        </Typography>
                        <Box
                          display="flex"
                          gap={1}
                          alignItems="center"
                        >
                          <Chip
                            icon={folder.public_boolean ? <Visibility /> : <VisibilityOff />}
                            label={folder.public_boolean ? "Public" : "Private"}
                            size="small"
                            color={folder.public_boolean ? "success" : "default"}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {cards.length} cards
                          </Typography>
                        </Box>
                      </Box>

                      {isAuthed && !isPublicFolder && (
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/folders/${folderId}/edit`)}
                        >
                          Edit Folder
                        </Button>
                      )}
                    </Box>

                    <AsyncData
                      loading={isAuthed ? cardsLoading : isLoadingPublic}
                      error={cardsError}
                    >
                      <Grid
                        container
                        spacing={3}
                      >
                        {cards.map((card) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            lg={4}
                            key={card.id}
                          >
                            <CardItem card={card} />
                          </Grid>
                        ))}
                      </Grid>

                      {cards.length === 0 && (
                        <Box
                          textAlign="center"
                          py={8}
                        >
                          <Typography
                            variant="h6"
                            gutterBottom
                          >
                            No cards in this folder yet
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Add cards to this folder to study!
                          </Typography>
                          {isAuthed && !isPublicFolder && (
                            <Button
                              variant="contained"
                              component={Link}
                              to={`/folders/${folderId}/cards/create`}
                              sx={{
                                mt: 2,
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
                              Add First Card
                            </Button>
                          )}
                        </Box>
                      )}
                    </AsyncData>

                    {/* Floating Action Buttons */}
                    {cards.length > 0 && (
                      <Fab
                        color="secondary"
                        aria-label="study cards"
                        sx={{
                          position: "fixed",
                          bottom: isAuthed && !isPublicFolder ? 88 : 16,
                          right: 16,
                          background: darkMode ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(45deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
                          "&:hover": {
                            background: darkMode ? "linear-gradient(45deg, #00b8e6 0%, #3069c2 50%, #e080e8 100%)" : "linear-gradient(45deg, #1349a0 0%, #1764c2 50%, #1e88e5 100%)",
                            transform: "scale(1.1)",
                            boxShadow: darkMode ? "0 8px 25px rgba(0, 210, 255, 0.4)" : "0 8px 25px rgba(21, 101, 192, 0.4)",
                          },
                          transition: "all 0.3s ease",
                          boxShadow: darkMode ? "0 4px 20px rgba(0, 210, 255, 0.3)" : "0 4px 20px rgba(21, 101, 192, 0.3)",
                        }}
                        onClick={() => navigate(`/folders/${folderId}/study${isPublicFolder ? "?public=true" : ""}`)}
                      >
                        <QuizIcon />
                      </Fab>
                    )}

                    {isAuthed && !isPublicFolder && (
                      <Fab
                        color="primary"
                        aria-label="add card"
                        sx={{
                          position: "fixed",
                          bottom: 16,
                          right: 16,
                          background: darkMode ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(45deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
                          "&:hover": {
                            background: darkMode ? "linear-gradient(45deg, #00b8e6 0%, #3069c2 50%, #e080e8 100%)" : "linear-gradient(45deg, #1349a0 0%, #1764c2 50%, #1e88e5 100%)",
                            transform: "scale(1.1)",
                            boxShadow: darkMode ? "0 8px 25px rgba(0, 210, 255, 0.4)" : "0 8px 25px rgba(21, 101, 192, 0.4)",
                          },
                          transition: "all 0.3s ease",
                          boxShadow: darkMode ? "0 4px 20px rgba(0, 210, 255, 0.3)" : "0 4px 20px rgba(21, 101, 192, 0.3)",
                        }}
                        component={Link}
                        to={`/folders/${folderId}/cards/create`}
                      >
                        <AddIcon />
                      </Fab>
                    )}
                  </>
                )}
              </>
            )}
          </AsyncData>
        </Container>
      </Box>
    </>
  );
};

export default FolderDetail;
