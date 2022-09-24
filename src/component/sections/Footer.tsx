import { Box, styled } from "@mui/material";

export function Footer() {
  const date = new Date()
  const year = date.getFullYear()
  return (
    <FooterWrap>
      <Box>
        © {year} All rights reserved.
      </Box>
    </FooterWrap>
  );
}

/* ======== STYLED ======== */
const FooterWrap = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignContent: "space-between",
  justifyContent: "space-between",
  padding: "10px 2rem",
  borderTop: `1px solid ${theme.palette.divider}`,
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0)",
  position: "fixed",
  bottom: 0
}));
