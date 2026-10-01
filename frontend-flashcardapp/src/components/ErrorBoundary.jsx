import React from "react";
import { Box, Typography, Button, Alert } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    console.error("Error stack:", error.stack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          textAlign="center"
          py={8}
        >
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="h6"
              gutterBottom
            >
              Something went wrong
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </Typography>
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
