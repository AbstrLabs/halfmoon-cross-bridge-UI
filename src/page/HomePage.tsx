import {
  Paper,
  Typography,
  Box,
  styled,
  Grid,
  Button
} from "@mui/material";

import { Footer } from "../component/sections/Footer"

export function HomePage() {
  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.primary,
    background: "rgba(255, 255, 255, 0.04)",
    fontSize: "24px"
  }));

  return (
    <Box textAlign="center" sx={{ fontFamily: "Regular, sans-serif", maxWidth: 1000 }}>
      <Typography
        sx={{
          fontFamily: "Regular, sans-serif",
          fontSize: "90px",
          background: "linear-gradient(90.96deg,#7ad6de  0.59%, #7ee6a7 99.19%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          textAlign: "left"
        }}
      > Bringing
      </Typography>
      <Typography
        sx={{
          fontFamily: "Regular, sans-serif",
          fontSize: "72px",
          background: "linear-gradient(90.96deg,#7ee6a7  0.59%, #7ad6de 99.19%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          textAlign: "left"
        }}
      > NEAR to Algorand
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Item>Building interoperability for web 3.0 and more</Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>Easy and simple operations to bridge token</Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>High speed and low fees, no limit on transfering amount</Item>
        </Grid>
      </Grid>
      <Box
        sx={{
          textAlign: "left"
        }}
      >
        <Button
          variant="contained"
          onClick={() => window.location.replace(window.location.origin + "/bridge ")}
          sx={{ mt: 3, ml: 1 }}
        >Go to Bridge
        </Button>
      </Box>
      <Footer />
    </Box>
  );
}
