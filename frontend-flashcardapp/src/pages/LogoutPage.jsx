import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../contexts/auth";

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">Logging you out...</Typography>
    </Box>
  );
};

export default LogoutPage;
