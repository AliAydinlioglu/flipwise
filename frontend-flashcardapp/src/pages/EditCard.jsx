import React, { useEffect } from "react";
import { Box, Typography, Paper, TextField, Button, Alert, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import useSWR, { mutate } from "swr";
import { useThemeMode } from "../contexts/Theme.context";
import * as api from "../api";
import AsyncData from "../components/AsyncData";
import { createCardValidationRules, gradients } from "../constants";

const EditCard = () => {
  const { darkMode } = useThemeMode();
  const navigate = useNavigate();
  const { folderId, cardId } = useParams();

  const { data: folder, error: folderError, isLoading: folderLoading } = useSWR(folderId ? `users/folders/${folderId}` : null, api.getById);
  const { data: card, error: cardError, isLoading: cardLoading } = useSWR(folderId && cardId ? `users/folders/${folderId}/cards/${cardId}` : null, api.getById);
  const { data: existingCards = [], error: cardsError, isLoading: cardsLoading } = useSWR(folderId ? `users/folders/${folderId}/cards` : null, api.getById);

  const otherCards = existingCards.filter((c) => c.id !== parseInt(cardId));
  const validationRules = createCardValidationRules(otherCards);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  useEffect(() => {
    if (card) {
      setValue("front", card.front);
      setValue("back", card.back);
    }
  }, [card, setValue]);

  const watchedValues = watch();

  const { trigger: updateCard, isMutating: isUpdating, error: updateError } = useSWRMutation(`users/folders/${folderId}/cards/${cardId}`, api.put);

  const onSubmit = async (data) => {
    try {
      await updateCard({
        front: data.front,
        back: data.back,
      });
      mutate(`users/folders/${folderId}/cards`);
      navigate(`/folders/${folderId}`);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/folders/${folderId}`);
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
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "20px",
              background: darkMode ? "rgba(30, 30, 30, 0.85)" : "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.2)",
              boxShadow: darkMode ? "0 20px 40px rgba(0, 0, 0, 0.3)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                background: darkMode ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 50%, #f093fb 100%)" : "linear-gradient(45deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textAlign: "center",
                mb: 3,
              }}
            >
              Edit Card
            </Typography>

            <AsyncData
              loading={folderLoading || cardLoading}
              error={folderError || cardError}
            >
              {folder && card && (
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

              {updateError && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    backgroundColor: darkMode ? "rgba(244, 67, 54, 0.1)" : "rgba(244, 67, 54, 0.1)",
                    color: darkMode ? "#fff" : "#333",
                  }}
                >
                  {updateError?.response?.data?.message || "Failed to update card"}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Question (Front)"
                    variant="outlined"
                    multiline
                    rows={3}
                    error={!!errors.front}
                    helperText={errors.front?.message || `${watchedValues.front?.length || 0}/100 characters. Enter the question or prompt for this flashcard.`}
                    {...register("front", validationRules.front)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    label="Answer (Back)"
                    variant="outlined"
                    multiline
                    rows={4}
                    error={!!errors.back}
                    helperText={errors.back?.message || `${watchedValues.back?.length || 0}/500 characters. Enter the answer or explanation for this flashcard.`}
                    {...register("back", validationRules.back)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isUpdating}
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
                      },
                      transition: "all 0.3s ease",
                      boxShadow: darkMode ? "0 4px 15px rgba(0, 210, 255, 0.3)" : "0 4px 15px rgba(21, 101, 192, 0.3)",
                    }}
                  >
                    {isUpdating ? "Updating..." : "Update Card"}
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
                      borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                      color: darkMode ? "#fff" : "#333",
                      "&:hover": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                        background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </AsyncData>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default EditCard;
