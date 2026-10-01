import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <Box
      textAlign="center"
      py={8}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        Page Not Found
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
      >
        The page at <code>{pathname}</code> could not be found.
      </Typography>
      <Button
        variant="contained"
        onClick={handleGoHome}
        sx={{ mt: 2 }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
