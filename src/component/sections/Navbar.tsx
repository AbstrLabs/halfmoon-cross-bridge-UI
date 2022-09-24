import { Brightness4, Brightness7, BrightnessAuto } from "@mui/icons-material";
import { Tabs, Tab, IconButton, Box } from "@mui/material";
import React from 'react';
import { useTernaryDarkMode } from "usehooks-ts";

interface LinkTabProps {
  label: string;
  href: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // event.preventDefault();
      }}
      {...props}
    />
  );
}

export function Navbar() {
  const { ternaryDarkMode, toggleTernaryDarkMode } = useTernaryDarkMode();
  const url = window.location.pathname
  let value = url === "/" ? 0 :
    (url === "/bridge" ? 1 :
      (url === "/docs" ? 2 : 3)
    )

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <IconButton color="primary" onClick={toggleTernaryDarkMode}
        sx={{ position: "relative" }}
      >
        {ternaryDarkMode === "dark" ? (
          <Brightness4 />
        ) : ternaryDarkMode === "light" ? (
          <Brightness7 />
        ) : (
          <BrightnessAuto />
        )}
      </IconButton>
      <Tabs value={value} aria-label="nav tabs example">
        <LinkTab label="Home" href="/" />
        <LinkTab label="Bridge" href="/bridge" />
        <LinkTab label="Docs" href="/docs" />
      </Tabs>
    </Box>

  );
}
