import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
      data-cy="loader"
    >
      <CircularProgress />
    </Box>
  );
}
