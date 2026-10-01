import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { Brightness4, Brightness7, AccountCircle, Logout as LogoutIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import { useThemeMode } from "../contexts/Theme.context";
import { APP_CONSTANTS, gradients } from "../constants";

const Navbar = () => {
  const { user, logout, isAuthed } = useAuth();
  const { darkMode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      data-cy="navbar"
      sx={{
        zIndex: 1000,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        borderBottom: (theme) => (theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.2)"),
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              background: "linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
            data-cy="navbar-home"
          >
            {APP_CONSTANTS.APP_NAME}
          </Link>
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            data-cy="theme-toggle"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.05)",
              },
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {!isAuthed && (
            <Button
              color="inherit"
              component={Link}
              to="/public-folders"
              data-cy="navbar-public-folders"
              sx={{
                borderRadius: "12px",
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Public Folders
            </Button>
          )}

          {isAuthed ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/folders"
                data-cy="navbar-my-folders"
                sx={{
                  borderRadius: "12px",
                  px: 2,
                  py: 1,
                  transition: "all 0.3s ease",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                My Folders
              </Button>
              <IconButton
                color="inherit"
                onClick={handleMenuClick}
                data-cy="navbar-profile"
                sx={{
                  ml: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                data-cy="profile-menu"
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "12px",
                    backdropFilter: "blur(20px)",
                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)"),
                    border: (theme) => (theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)"),
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  disabled
                  sx={{
                    opacity: 1,
                    "&.Mui-disabled": {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: "medium" }}
                  >
                    {user?.email}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  data-cy="navbar-logout"
                  sx={{
                    borderRadius: "8px",
                    mx: 1,
                    my: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"),
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1, fontSize: "small" }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
