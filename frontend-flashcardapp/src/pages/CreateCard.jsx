import React from "react";
import { Box, Typography, Paper, TextField, Button, Alert, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { useThemeMode } from "../contexts/Theme.context";
import * as api from "../api";
import AsyncData from "../components/AsyncData";
import { createCardValidationRules, gradients } from "../constants";

const CreateCard = () => {
  const { darkMode } = useThemeMode();
  const navigate = useNavigate();
  const { folderId: paramFolderId } = useParams();
  const [searchParams] = useSearchParams();
  const folderId = paramFolderId || searchParams.get("folderId");
  const fromMyFolders = searchParams.get("from") === "myfolders";

  const handleCancel = () => {
    if (fromMyFolders) {
      navigate("/folders");
    } else {
      const destination = paramFolderId ? `/folders/${folderId}` : "/folders";
      navigate(destination);
    }
  };

  const { data: folder, error: folderError, isLoading: folderLoading } = useSWR(folderId ? `users/folders/${folderId}` : null, api.getById);
  const { data: existingCards = [], error: cardsError, isLoading: cardsLoading } = useSWR(folderId ? `users/folders/${folderId}/cards` : null, api.getById);

  const validationRules = createCardValidationRules(existingCards);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchedValues = watch();

  const { trigger: createCard, isMutating: isCreating, error: createError } = useSWRMutation(`users/folders/${folderId}/cards`, api.post);

  const onSubmit = async (data) => {
    try {
      await createCard({
        front: data.front,
        back: data.back,
      });
      navigate(`/folders/${folderId}`);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode ? "linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)" : "linear-gradient(45deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth="md">
          <AsyncData
            loading={folderLoading}
            error={folderError}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: "20px",
                background: darkMode ? "rgba(30, 30, 30, 0.85)" : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(20px)",
                border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: darkMode ? "0 8px 32px rgba(0, 210, 255, 0.15)" : "0 8px 32px rgba(21, 101, 192, 0.15)",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: darkMode ? "#fff" : "#333",
                  fontWeight: "bold",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                Create New Card
              </Typography>

              {folder && (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)",
                      textAlign: "center",
                      mb: 2,
                      fontStyle: "italic",
                    }}
                  >
                    in folder: <strong>{folder.name}</strong>
                  </Typography>
                </>
              )}

              {createError && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    backgroundColor: darkMode ? "rgba(244, 67, 54, 0.1)" : "rgba(244, 67, 54, 0.1)",
                    color: darkMode ? "#fff" : "#333",
                  }}
                >
                  {createError?.response?.data?.message || "Failed to create card"}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Question (Front)"
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!errors.front}
                  helperText={errors.front?.message || `${watchedValues.front?.length || 0}/100 characters. Enter the question or prompt for this flashcard.`}
                  {...register("front", validationRules.front)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                      "& fieldset": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: darkMode ? "#00d2ff" : "#1976d2",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    },
                    "& .MuiInputBase-input": {
                      color: darkMode ? "#fff" : "#333",
                    },
                    "& .MuiFormHelperText-root": {
                      color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Answer (Back)"
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!errors.back}
                  helperText={errors.back?.message || `${watchedValues.back?.length || 0}/500 characters. Enter the answer or explanation for this flashcard.`}
                  {...register("back", validationRules.back)}
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                      "& fieldset": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: darkMode ? "#00d2ff" : "#1976d2",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    },
                    "& .MuiInputBase-input": {
                      color: darkMode ? "#fff" : "#333",
                    },
                    "& .MuiFormHelperText-root": {
                      color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
                    },
                  }}
                />

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isCreating}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: "600",
                      px: 4,
                      py: 1.5,
                      background: darkMode ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(45deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
                      "&:hover": {
                        background: darkMode ? "linear-gradient(45deg, #00b8e6 0%, #3069c2 50%, #e080e8 100%)" : "linear-gradient(45deg, #1349a0 0%, #1764c2 50%, #1e88e5 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: darkMode ? "0 6px 20px rgba(0, 210, 255, 0.4)" : "0 6px 20px rgba(21, 101, 192, 0.4)",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: darkMode ? "0 4px 15px rgba(0, 210, 255, 0.3)" : "0 4px 15px rgba(21, 101, 192, 0.3)",
                    }}
                  >
                    {isCreating ? "Creating..." : "Create Card"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: "600",
                      px: 4,
                      py: 1.5,
                      color: darkMode ? "#fff" : "#333",
                      borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                      "&:hover": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </Paper>
          </AsyncData>
        </Container>
      </Box>
    </>
  );
};

export default CreateCard;
