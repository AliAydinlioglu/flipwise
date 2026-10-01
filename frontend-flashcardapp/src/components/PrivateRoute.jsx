import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../contexts/auth";

export default function PrivateRoute({ children }) {
  const { ready, isAuthed } = useAuth();
  const { pathname } = useLocation();

  if (!ready) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthed) {
    return children;
  }

  return (
    <Navigate
      replace
      to={`/login?redirect=${pathname}`}
    />
  );
}
