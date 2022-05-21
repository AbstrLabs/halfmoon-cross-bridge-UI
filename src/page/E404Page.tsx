import { Box } from "@mui/system";
import { Typography } from "@mui/material";

export function E404Page() {
  return (
    <Box textAlign="center">
      <Box height="20px" />
      <Typography variant="h2">NOT FOUND</Typography>
      <Typography variant="body1">page not found</Typography>
      <img
        style={{ maxWidth: "60vw", maxHeight: "60vh" }}
        alt="page-not-found"
        src={process.env.PUBLIC_URL + "/svg/page-not-found.svg"}
        title="temp pic from https://all-free-download.com/free-vector/download/error-404-page-not-found_6845510.html"
      />
    </Box>
  );
}
