import React, { createContext, useContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#dc004e",
      },
      background: {
        default: darkMode ? "#121212" : "#fafafa",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary: darkMode ? "#b0b0b0" : "#666666",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? "#121212" : "#fafafa",
            color: darkMode ? "#ffffff" : "#000000",
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
          "*": {
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: darkMode ? "#2e2e2e" : "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: darkMode ? "#555" : "#888",
              borderRadius: "4px",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
          },
        },
      },
    },
  });

  const value = {
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
