import React, { useCallback, useState } from "react";
import { Box, Button, TextField, Typography, Grid, Paper, Alert, Container, Fade, Card, CardContent, IconButton, InputAdornment } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import { useThemeMode } from "../contexts/Theme.context";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createValidationRules, gradients, cardStyles } from "../constants";
import Navbar from "../components/Navbar";
import AsyncData from "../components/AsyncData";

const validationRules = createValidationRules("register");

export default function RegisterPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode } = useThemeMode();
  const { error, loading, register: registerUser } = useAuth();
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const handleRegister = useCallback(
    async (data) => {
      setLocalError(null);
      const { email, password } = data;

      const result = await registerUser({ email, password });

      if (result.success) {
        navigate("/");
      } else {
        let errorMessage = result.error || "Registration failed. Please try again.";

        if (errorMessage.includes("Duplicate entry") || errorMessage.includes("already exists") || errorMessage.includes("UNIQUE constraint failed")) {
          errorMessage = "An account with this email address already exists. Please use a different email or try logging in.";
        } else if (errorMessage.includes("validation") || errorMessage.includes("Invalid")) {
          errorMessage = "Please check your email format and ensure your password meets the requirements.";
        } else if (errorMessage.includes("server") || errorMessage.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        }

        setLocalError(errorMessage);
      }
    },
    [registerUser, navigate]
  );

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: darkMode ? gradients.pageBackground : gradients.pageBackgroundLight,
          minHeight: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode
              ? "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)"
              : "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            animation: "float 6s ease-in-out infinite",
          },
          "@keyframes float": {
            "0%, 100%": {
              transform: "translateY(0px)",
            },
            "50%": {
              transform: "translateY(-20px)",
            },
          },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Fade
            in
            timeout={1000}
          >
            <Card
              sx={{
                borderRadius: "20px",
                backdropFilter: "blur(20px)",
                ...(darkMode ? cardStyles.glassDark : cardStyles.glassLight),
                boxShadow: darkMode ? "0 25px 45px rgba(0, 0, 0, 0.3)" : "0 25px 45px rgba(0, 0, 0, 0.1)",
                border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent
                sx={{
                  p: 6,
                  backgroundColor: darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.7)",
                  borderRadius: "16px",
                  margin: "8px",
                }}
              >
                <Typography
                  variant="h3"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: darkMode ? "#ffffff" : "#1a1a1a",
                    mb: 4,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  Join FlipWise
                </Typography>

                {/* Show error message if present */}
                {localError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: "12px",
                      backgroundColor: darkMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: darkMode ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(239, 68, 68, 0.2)",
                      color: darkMode ? "#ffffff" : "#dc2626",
                      "& .MuiAlert-icon": {
                        color: darkMode ? "#f87171" : "#ef4444",
                      },
                    }}
                    onClose={() => setLocalError(null)}
                  >
                    {localError}
                  </Alert>
                )}

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: "12px",
                      backgroundColor: darkMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: darkMode ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(239, 68, 68, 0.2)",
                      color: darkMode ? "#ffffff" : "#dc2626",
                      "& .MuiAlert-icon": {
                        color: darkMode ? "#f87171" : "#ef4444",
                      },
                    }}
                  >
                    {error.message || "Registration failed"}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={handleSubmit(handleRegister)}
                >
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={validationRules.email}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        placeholder="john.doe@example.com"
                        margin="normal"
                        type="email"
                        variant="outlined"
                        error={Boolean(errors.email)}
                        helperText={errors.email ? errors.email.message : ""}
                        sx={{
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)",
                            color: darkMode ? "#ffffff" : "#1f2937",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8b5cf6",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#7c3aed",
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode ? "#e5e7eb" : "#6b7280",
                            "&.Mui-focused": {
                              color: "#7c3aed",
                            },
                          },
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={validationRules.password}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        placeholder="mypassword123"
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        error={Boolean(errors.password)}
                        helperText={errors.password ? errors.password.message : ""}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)",
                            color: darkMode ? "#ffffff" : "#1f2937",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8b5cf6",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#7c3aed",
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode ? "#e5e7eb" : "#6b7280",
                            "&.Mui-focused": {
                              color: "#7c3aed",
                            },
                          },
                          "& .MuiIconButton-root": {
                            color: darkMode ? "#e5e7eb" : "#6b7280",
                          },
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      ...validationRules.confirmPassword,
                      validate: (value) => value === password || "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Confirm Password"
                        placeholder="mypassword123"
                        margin="normal"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 3,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)",
                            color: darkMode ? "#ffffff" : "#1f2937",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8b5cf6",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#7c3aed",
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode ? "#e5e7eb" : "#6b7280",
                            "&.Mui-focused": {
                              color: "#7c3aed",
                            },
                          },
                          "& .MuiIconButton-root": {
                            color: darkMode ? "#e5e7eb" : "#6b7280",
                          },
                        }}
                      />
                    )}
                  />
                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      disabled={loading}
                      sx={{
                        background: darkMode ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                        boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
                        borderRadius: "15px",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        padding: "12px 24px",
                        color: "#ffffff",
                        "&:hover": {
                          background: darkMode ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(139, 92, 246, 0.4)",
                        },
                        "&:disabled": {
                          background: darkMode ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)" : "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)",
                          color: darkMode ? "#6b7280" : "#374151",
                          transform: "none",
                        },
                      }}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </Box>
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: darkMode ? "#e5e7eb" : "#4b5563" }}
                    >
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          textDecoration: "none",
                          color: darkMode ? "#a78bfa" : "#7c3aed",
                          fontWeight: "bold",
                          transition: "color 0.3s ease",
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </>
  );
}
