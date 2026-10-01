import { Alert, AlertTitle } from "@mui/material";
import { isAxiosError } from "axios";

export default function Error({ error }) {
  if (isAxiosError(error)) {
    return (
      <Alert
        severity="error"
        data-cy="axios_error_message"
        sx={{ mb: 2 }}
      >
        <AlertTitle>Oops, something went wrong</AlertTitle>
        {error?.response?.data?.message || error.message}
        {error?.response?.data?.details && (
          <>
            <br />
            {JSON.stringify(error.response.data.details)}
          </>
        )}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ mb: 2 }}
      >
        <AlertTitle>An unexpected error occurred</AlertTitle>
        {error.message || JSON.stringify(error)}
      </Alert>
    );
  }

  return null;
}
