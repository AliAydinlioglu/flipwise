import React, { useState, useMemo, useEffect } from "react";
import AsyncData from "../components/AsyncData";
import Navbar from "../components/Navbar";
import { formatCardCount, getCardStyles } from "../constants";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Fab,
  Container,
  Alert,
  Fade,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  IconButton,
  Menu,
  MenuList,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility,
  VisibilityOff,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddBox as AddCardIcon,
  Folder as FolderIcon,
  Warning as WarningIcon,
  Public as PublicIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { useAuth } from "../contexts/auth";
import { useThemeMode } from "../contexts/Theme.context";
import * as api from "../api";

const FolderCard = ({ folder, index = 0, onStudy, onEdit, onDelete, onAddCard, isPublicView = false }) => {
  const { darkMode } = useThemeMode();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(folder);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(folder);
    handleMenuClose();
  };

  const handleAddCard = () => {
    onAddCard(folder);
    handleMenuClose();
  };

  return (
    <Fade
      in
      timeout={500 + index * 150}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          ...getCardStyles(darkMode),
          "&:hover": {
            transform: "translateY(-6px) scale(1.02)",
            ...getCardStyles(darkMode)["&:hover"],
            boxShadow: darkMode ? "0 12px 40px rgba(0, 210, 255, 0.25), 0 0 30px rgba(118, 75, 162, 0.2)" : "0 12px 40px rgba(21, 101, 192, 0.2), 0 0 30px rgba(21, 101, 192, 0.1)",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, position: "relative" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            mb={2}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold", flexGrow: 1, mr: 1 }}
            >
              {folder.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip
                icon={folder.public_boolean ? <Visibility /> : <VisibilityOff />}
                label={folder.public_boolean ? "Public" : "Private"}
                size="small"
                color={folder.public_boolean ? "success" : "default"}
                sx={{ borderRadius: "8px", fontWeight: "medium" }}
              />
              {!isPublicView && (
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    "&:hover": {
                      color: darkMode ? "#00d2ff" : "#1565c0",
                      backgroundColor: darkMode ? "rgba(0, 210, 255, 0.1)" : "rgba(21, 101, 192, 0.1)",
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>
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
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            size="small"
            onClick={() => onStudy(folder)}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "medium" }}
          >
            Study
          </Button>
          <Button
            size="small"
            component={Link}
            to={`/folders/${folder.id}${isPublicView ? "?public=true" : ""}`}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "medium" }}
          >
            View Details
          </Button>
        </CardActions>

        {!isPublicView && (
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                background: darkMode
                  ? "linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(118, 75, 162, 0.3) 100%)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.8) 100%)",
                backdropFilter: "blur(20px)",
                border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.3)",
                boxShadow: darkMode ? "0 8px 32px rgba(0, 210, 255, 0.2)" : "0 8px 32px rgba(21, 101, 192, 0.15)",
              },
            }}
          >
            <MenuList>
              <MenuItem onClick={handleAddCard}>
                <ListItemIcon>
                  <AddCardIcon sx={{ color: darkMode ? "#00d2ff" : "#1565c0" }} />
                </ListItemIcon>
                <ListItemText primary="Add Card" />
              </MenuItem>
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon sx={{ color: darkMode ? "#00d2ff" : "#1565c0" }} />
                </ListItemIcon>
                <ListItemText primary="Edit Folder" />
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon sx={{ color: "#f44336" }} />
                </ListItemIcon>
                <ListItemText primary="Delete Folder" />
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Card>
    </Fade>
  );
};

const MyFolders = () => {
  const { isAuthed, user } = useAuth();
  const { darkMode } = useThemeMode();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [showPublicFolders, setShowPublicFolders] = useState(false);

  const apiEndpoint = showPublicFolders ? "folders" : isAuthed ? "users/folders" : null;
  const { data: folders, isLoading, error, mutate: mutateFolders } = useSWR(apiEndpoint, api.getById);

  const { data: userFolders } = useSWR(showPublicFolders && isAuthed ? "users/folders" : null, api.getById);

  useEffect(() => {
    if (user?.id) {
      mutate("folders");
      mutate("users/folders");
    }
  }, [user?.id]);

  const filteredFolders = useMemo(() => {
    if (!folders) return [];

    let foldersToFilter = folders;

    if (showPublicFolders) {
      const userFolderIds = new Set(userFolders?.map((folder) => folder.id) || []);

      foldersToFilter = folders.filter((folder) => {
        const isPublic = folder.public_boolean === true || folder.public_boolean === 1;

        const isUserFolder = userFolderIds.has(folder.id);

        return isPublic && !isUserFolder;
      });
    }

    return foldersToFilter.filter((folder) => {
      const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (showPublicFolders) {
        return matchesSearch;
      } else {
        const matchesVisibility = visibilityFilter === "all" || (visibilityFilter === "public" && folder.public_boolean) || (visibilityFilter === "private" && !folder.public_boolean);
        return matchesSearch && matchesVisibility;
      }
    });
  }, [folders, searchTerm, visibilityFilter, showPublicFolders, userFolders]);

  const handleStudy = (folder) => {
    if (showPublicFolders) {
      navigate(`/folders/${folder.id}/study?public=true`);
    } else {
      navigate(`/folders/${folder.id}/study`);
    }
  };

  const handleCreateFolder = () => {
    navigate("/folders/create");
  };

  const handleEditFolder = (folder) => {
    navigate(`/folders/${folder.id}/edit?from=myfolders`);
  };

  const handleDeleteFolder = async (folder) => {
    setFolderToDelete(folder);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFolder = async () => {
    if (!folderToDelete) return;

    try {
      await api.deleteById(`users/folders`, { arg: folderToDelete.id });
      mutateFolders();
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder. Please try again.");
    }
  };

  const cancelDeleteFolder = () => {
    setDeleteDialogOpen(false);
    setFolderToDelete(null);
  };

  const handleAddCard = (folder) => {
    navigate(`/cards/create?folderId=${folder.id}&from=myfolders`);
  };

  const handleSwitchToggle = (event) => {
    setShowPublicFolders(event.target.checked);
    setSearchTerm("");
    setVisibilityFilter("all");
  };

  if (!isAuthed && !showPublicFolders) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          overflow: "auto",
          background: darkMode
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #764ba2 70%, #667eea 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)",
        }}
      >
        <Navbar />
        <Container
          maxWidth="sm"
          sx={{ py: 4, textAlign: "center", mt: 10 }}
        >
          <Alert
            severity="info"
            sx={{ borderRadius: "12px", mb: 3 }}
          >
            <Typography
              variant="h6"
              gutterBottom
            >
              Please log in to view your folders
            </Typography>
            <Typography variant="body2">You need to be authenticated to access your personal folders.</Typography>
          </Alert>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showPublicFolders}
                  onChange={handleSwitchToggle}
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      "&.Mui-checked": {
                        color: darkMode ? "#00d2ff" : "#1565c0",
                        "& + .MuiSwitch-track": {
                          backgroundColor: darkMode ? "#00d2ff" : "#1565c0",
                        },
                      },
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span style={{ fontSize: "20px" }}>🌍</span>
                  <Typography sx={{ color: darkMode ? "#fff" : "#1565c0", fontWeight: "medium" }}>Browse Community Folders</Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        background: darkMode
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #764ba2 70%, #667eea 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)",
      }}
    >
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{ pt: 6, pb: 4 }}
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
              {showPublicFolders ? "Community Folders" : "My Folders"}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showPublicFolders}
                  onChange={handleSwitchToggle}
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      "&.Mui-checked": {
                        color: darkMode ? "#00d2ff" : "#1565c0",
                        "& + .MuiSwitch-track": {
                          backgroundColor: darkMode ? "#00d2ff" : "#1565c0",
                        },
                      },
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {showPublicFolders ? (
                    <>
                      <PublicIcon sx={{ color: darkMode ? "#00d2ff" : "#1565c0" }} />
                      <Typography sx={{ color: darkMode ? "#fff" : "#1565c0", fontWeight: "medium" }}>Community Folders</Typography>
                    </>
                  ) : (
                    <>
                      <PersonIcon sx={{ color: darkMode ? "#00d2ff" : "#1565c0" }} />
                      <Typography sx={{ color: darkMode ? "#fff" : "#1565c0", fontWeight: "medium" }}>My Folders</Typography>
                    </>
                  )}
                </Box>
              }
              sx={{ m: 0 }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#1565c0",
              fontWeight: "500",
            }}
          >
            {showPublicFolders ? "Browse and study from publicly available folders created by the community" : "Organize your study materials with flashcard folders"}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              background: darkMode
                ? "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(118, 75, 162, 0.3) 50%, rgba(102, 126, 234, 0.2) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.7) 100%)",
              backdropFilter: "blur(20px)",
              border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.3)",
              mb: 3,
              boxShadow: darkMode ? "0 8px 32px rgba(0, 210, 255, 0.1), 0 0 60px rgba(118, 75, 162, 0.2)" : "0 8px 32px rgba(21, 101, 192, 0.15), 0 4px 20px rgba(25, 118, 210, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              {showPublicFolders ? (
                <PublicIcon
                  sx={{
                    color: darkMode ? "#00d2ff" : "#1565c0",
                    fontSize: "2rem",
                    filter: darkMode ? "drop-shadow(0 0 10px rgba(0, 210, 255, 0.5))" : "drop-shadow(0 2px 8px rgba(21, 101, 192, 0.3))",
                  }}
                />
              ) : (
                <FolderIcon
                  sx={{
                    color: darkMode ? "#00d2ff" : "#1565c0",
                    fontSize: "2rem",
                    filter: darkMode ? "drop-shadow(0 0 10px rgba(0, 210, 255, 0.5))" : "drop-shadow(0 2px 8px rgba(21, 101, 192, 0.3))",
                  }}
                />
              )}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  background: darkMode ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(45deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {showPublicFolders ? "Browse Community Folders" : "Manage Your Folders"}
              </Typography>
            </Box>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={showPublicFolders ? 12 : 8}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={showPublicFolders ? "Search community folders by name..." : "Search your folders by name..."}
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
              {!showPublicFolders && (
                <Grid
                  item
                  xs={12}
                  sm={4}
                >
                  <FormControl
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel
                      sx={{
                        color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(21, 101, 192, 0.8)",
                        "&.Mui-focused": {
                          color: darkMode ? "#00d2ff" : "#1565c0",
                        },
                      }}
                    >
                      Visibility
                    </InputLabel>
                    <Select
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value)}
                      label="Visibility"
                      sx={{
                        borderRadius: "12px",
                        background: darkMode
                          ? "linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(58, 123, 213, 0.1) 50%, rgba(240, 147, 251, 0.1) 100%)"
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.7) 100%)",
                        backdropFilter: "blur(15px)",
                        color: darkMode ? "#fff" : "#1565c0",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "rgba(0, 210, 255, 0.3)" : "rgba(21, 101, 192, 0.4)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "rgba(0, 210, 255, 0.5)" : "rgba(21, 101, 192, 0.6)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#00d2ff" : "#1565c0",
                          borderWidth: "2px",
                        },
                      }}
                    >
                      <MenuItem value="all">All Folders</MenuItem>
                      <MenuItem value="public">Public Only</MenuItem>
                      <MenuItem value="private">Private Only</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            {(searchTerm || (!showPublicFolders && visibilityFilter !== "all")) && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: darkMode ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  Showing {filteredFolders.length} folders
                  {searchTerm && ` matching "${searchTerm}"`}
                  {!showPublicFolders && visibilityFilter !== "all" && ` (${visibilityFilter} only)`}
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
                {filteredFolders.map((folder, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={folder.id}
                  >
                    <FolderCard
                      folder={folder}
                      index={index}
                      onStudy={handleStudy}
                      onEdit={handleEditFolder}
                      onDelete={handleDeleteFolder}
                      onAddCard={handleAddCard}
                      isPublicView={showPublicFolders}
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
                  {searchTerm || (!showPublicFolders && visibilityFilter !== "all") ? "No folders match your criteria" : showPublicFolders ? "No community folders found" : "No folders found"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {searchTerm || (!showPublicFolders && visibilityFilter !== "all")
                    ? "Try adjusting your search or filter criteria to find more folders."
                    : showPublicFolders
                      ? "There are no community folders available at the moment."
                      : "Create your first folder to start organizing your study materials."}
                </Typography>
                {searchTerm || (!showPublicFolders && visibilityFilter !== "all") ? (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm("");
                      if (!showPublicFolders) {
                        setVisibilityFilter("all");
                      }
                    }}
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
                    Clear Filters
                  </Button>
                ) : (
                  !showPublicFolders && (
                    <Button
                      variant="contained"
                      onClick={handleCreateFolder}
                      startIcon={<AddIcon />}
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
                      }}
                    >
                      Create Your First Folder
                    </Button>
                  )
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
                {showPublicFolders ? "No community folders available" : "Welcome to Your Folders"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.8)",
                }}
              >
                {showPublicFolders ? "There are no public folders shared by the community yet." : "Start organizing your study materials by creating your first folder."}
              </Typography>
              {!showPublicFolders && (
                <Button
                  variant="contained"
                  onClick={handleCreateFolder}
                  startIcon={<AddIcon />}
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
                  }}
                >
                  Create Your First Folder
                </Button>
              )}
            </Box>
          )}
        </AsyncData>

        {!showPublicFolders && (
          <Fab
            color="primary"
            aria-label="add folder"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              background: darkMode ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(45deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
              "&:hover": {
                background: darkMode ? "linear-gradient(45deg, #00b8e6 0%, #3069c2 50%, #e080e8 100%)" : "linear-gradient(45deg, #1349a0 0%, #1764c2 50%, #1e88e5 100%)",
                transform: "scale(1.1)",
                boxShadow: darkMode ? "0 8px 25px rgba(0, 210, 255, 0.4)" : "0 8px 25px rgba(21, 101, 192, 0.4)",
              },
              transition: "all 0.3s ease",
              boxShadow: darkMode ? "0 4px 20px rgba(0, 210, 255, 0.3)" : "0 4px 20px rgba(21, 101, 192, 0.3)",
            }}
            onClick={handleCreateFolder}
          >
            <AddIcon />
          </Fab>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteFolder}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode ? "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)" : "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
            backdropFilter: "blur(20px)",
            border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.2)",
            borderRadius: "20px",
            boxShadow: darkMode ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(244, 67, 54, 0.2)" : "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 30px rgba(244, 67, 54, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pt: 4,
            pb: 2,
            color: darkMode ? "#fff" : "#1a1a2e",
            fontSize: "1.5rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <WarningIcon
            sx={{
              color: "#f44336",
              fontSize: "2rem",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.7 },
                "100%": { opacity: 1 },
              },
            }}
          />
          Delete Folder
        </DialogTitle>

        <DialogContent sx={{ px: 4, pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete <strong>&ldquo;{folderToDelete?.name}&rdquo;</strong>?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: darkMode ? "rgba(244, 67, 54, 0.8)" : "rgba(244, 67, 54, 0.7)",
              fontStyle: "italic",
            }}
          >
            This action cannot be undone and will delete all cards in this folder.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 2, gap: 2, justifyContent: "center" }}>
          <Button
            onClick={cancelDeleteFolder}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
              color: darkMode ? "#fff" : "#333",
              textTransform: "none",
              fontWeight: "600",
              "&:hover": {
                borderColor: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={confirmDeleteFolder}
            variant="contained"
            sx={{
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #f44336 0%, #d32f2f 100%)",
              textTransform: "none",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(244, 67, 54, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #d32f2f 0%, #b71c1c 100%)",
                boxShadow: "0 6px 20px rgba(244, 67, 54, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Delete Forever
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyFolders;
