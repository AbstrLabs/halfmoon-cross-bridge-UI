import { Box } from "@mui/system";
import { Typography } from "@mui/material";

export function E404Page() {
  return (
    <Box textAlign="center">
      <Typography variant="h1">not found</Typography>
      <Typography variant="body1">Route not found</Typography>
      <img
        style={{ maxWidth: "80%" }}
        alt="page-not-found"
        src={process.env.PUBLIC_URL + "/svg/page-not-found.svg"}
        title="temp pic from https://all-free-download.com/free-vector/download/error-404-page-not-found_6845510.html"
      />
    </Box>
  );
}
