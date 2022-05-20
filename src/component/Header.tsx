import { Box, styled } from "@mui/material";

import { Logo } from "./Logo";
import { Navbar } from "./Navbar";
import { useEffect } from "react";

export function Header() {
  useEffect(() => {
    return () => {};
    /* this is a lifecycle */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  backgroundColor: theme.palette.background.default,
}));
