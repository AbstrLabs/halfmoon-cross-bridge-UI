import { Box, styled } from "@mui/material";

import { Logo } from "./Logo";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <HeaderWrap>
      <Logo />
      <Navbar />
    </HeaderWrap>
  );
}

/* ======== STYLED ======== */
const HeaderWrap = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignContent: "space-between",
  justifyContent: "space-between",
  padding: "10px 2rem",
  paddingBottom: "0",
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0)",
}));
