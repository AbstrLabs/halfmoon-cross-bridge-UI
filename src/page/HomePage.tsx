import React from "react";
import { styled } from "@mui/material";

export function HomePage() {
  /* ======== MUI ======== */

  return (
    <BodyWrap>
      <CardsWrap>
        Lorem ipsum @2022-05-20 17:27:13 dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </CardsWrap>
      <CardsWrap>
        Lorem ipsum @2022-05-20 17:27:16 dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </CardsWrap>
    </BodyWrap>
  );
}

/* ======== STYLED ======== */
const BodyWrap = styled("div")({
  flex: "1 1 auto",
  margin: "0 20px 40px",
});
const CardsWrap = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "20px 0 0",
  display: "flex",
  maxWidth: "100%",
  padding: "10px",
  backgroundColor: theme.palette.background.default,
}));