import { Box, styled } from "@mui/material";

import { Logo } from "./Logo";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <HeaderWrap>
      <Logo />
      <Box sx={{ mx: 1 }} /* placeholder */ />
      <Navbar />
    </HeaderWrap>
  );
}

/* ======== STYLED ======== */
const HeaderWrap = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "10px 2rem",
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0)",
}));
