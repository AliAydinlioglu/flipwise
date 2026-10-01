import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, FormControlLabel, Switch, Alert, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { useThemeMode } from "../contexts/Theme.context";
import * as api from "../api";
import Navbar from "../components/Navbar";

const createFolderValidationRules = (existingFolders = []) => ({
  name: {
    required: "Folder name is required",
    minLength: { value: 2, message: "Folder name must be at least 2 characters long" },
    maxLength: { value: 50, message: "Folder name cannot exceed 50 characters" },
    validate: {
      notEmpty: (value) => {
        const trimmed = value?.trim();
        return (trimmed && trimmed.length > 0) || "Folder name cannot be blank";
      },
      noDuplicate: (value) => {
        const trimmed = value?.trim().toLowerCase();
        const exists = existingFolders.some((folder) => folder.name.toLowerCase() === trimmed);
        return !exists || "A folder with this name already exists";
      },
    },
  },
});

const autoCapitalize = (text) =>
  text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const CreateFolder = () => {
  const navigate = useNavigate();
  const { darkMode } = useThemeMode();
  const [folderName, setFolderName] = useState("");

  const { data: existingFolders = [] } = useSWR("users/folders", api.getById);

  const validationRules = createFolderValidationRules(existingFolders);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { trigger: createFolder, isMutating: isCreating, error: createError } = useSWRMutation("users/folders", api.post);

  const handleNameChange = (event) => {
    const value = event.target.value;
    const capitalized = autoCapitalize(value);
    setFolderName(capitalized);
    setValue("name", capitalized);
  };

  const onSubmit = async (data) => {
    try {
      await createFolder({
        name: data.name.trim(),
        public_boolean: data.public_boolean ? 1 : 0,
      });
      navigate("/folders");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "calc(100vh - 64px)",
          overflow: "auto",
          zIndex: 1,
          background: darkMode
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #764ba2 70%, #667eea 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)",
        }}
      >
        <Container
          maxWidth="md"
          sx={{ pt: 4, pb: 4 }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: darkMode
                ? "linear-gradient(45deg, #00d2ff 0%, #3a7bd5 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"
                : "linear-gradient(45deg, #1565c0 0%, #1976d2 25%, #1e88e5 50%, #2196f3 75%, #42a5f5 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: darkMode ? "0 0 30px rgba(0, 210, 255, 0.3)" : "0 2px 4px rgba(21, 101, 192, 0.3)",
              textAlign: "center",
              mb: 4,
            }}
          >
            Create New Folder
          </Typography>

          {createError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "12px",
                background: darkMode
                  ? "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)"
                  : "linear-gradient(135deg, rgba(255, 235, 238, 0.9) 0%, rgba(255, 205, 210, 0.8) 100%)",
                backdropFilter: "blur(10px)",
                border: darkMode ? "1px solid rgba(244, 67, 54, 0.3)" : "1px solid rgba(244, 67, 54, 0.2)",
              }}
            >
              {createError?.response?.data?.message || "Failed to create folder"}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              background: darkMode
                ? "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(118, 75, 162, 0.3) 50%, rgba(102, 126, 234, 0.2) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.7) 100%)",
              backdropFilter: "blur(20px)",
              border: darkMode ? "1px solid rgba(0, 210, 255, 0.2)" : "1px solid rgba(21, 101, 192, 0.3)",
              boxShadow: darkMode ? "0 8px 32px rgba(0, 210, 255, 0.1), 0 0 60px rgba(118, 75, 162, 0.2)" : "0 8px 32px rgba(21, 101, 192, 0.15), 0 4px 20px rgba(25, 118, 210, 0.1)",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Folder Name"
                margin="normal"
                value={folderName}
                error={!!errors.name}
                helperText={errors.name?.message || "Enter a unique name (2-50 characters). First letter of each word will be capitalized automatically."}
                {...register("name", validationRules.name)}
                onChange={handleNameChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: darkMode
                      ? "linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(58, 123, 213, 0.1) 50%, rgba(240, 147, 251, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.7) 100%)",
                    backdropFilter: "blur(15px)",
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
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(21, 101, 192, 0.8)",
                    "&.Mui-focused": {
                      color: darkMode ? "#00d2ff" : "#1565c0",
                    },
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    {...register("public_boolean")}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: darkMode ? "#00d2ff" : "#1565c0",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: darkMode ? "#00d2ff" : "#1565c0",
                      },
                    }}
                  />
                }
                label="Make this folder public"
                sx={{
                  mt: 3,
                  "& .MuiFormControlLabel-label": {
                    color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#1565c0",
                    fontWeight: "500",
                  },
                }}
              />

              <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isCreating}
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
                    "&:disabled": {
                      background: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                      color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.6)",
                    },
                  }}
                >
                  {isCreating ? "Creating..." : "Create Folder"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/folders")}
                  sx={{
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: "medium",
                    border: darkMode ? "2px solid rgba(255, 255, 255, 0.4)" : "2px solid rgba(21, 101, 192, 0.6)",
                    background: darkMode
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 100%)",
                    color: darkMode ? "#fff" : "#1565c0",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      border: darkMode ? "2px solid rgba(255, 255, 255, 0.6)" : "2px solid rgba(21, 101, 192, 0.8)",
                      background: darkMode
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%)"
                        : "linear-gradient(135deg, rgba(21, 101, 192, 0.1) 0%, rgba(21, 101, 192, 0.15) 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: darkMode ? "0 8px 25px rgba(255, 255, 255, 0.2)" : "0 8px 25px rgba(21, 101, 192, 0.25)",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default CreateFolder;
