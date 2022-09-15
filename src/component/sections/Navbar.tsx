import { Brightness4, Brightness7, BrightnessAuto } from "@mui/icons-material";
import { Button, ButtonGroup, IconButton } from "@mui/material";

import { useTernaryDarkMode } from "usehooks-ts";

export function Navbar() {
  const { ternaryDarkMode, toggleTernaryDarkMode } = useTernaryDarkMode();
  return (
    <div>
      <IconButton color="primary" onClick={toggleTernaryDarkMode}>
        {ternaryDarkMode === "dark" ? (
          <Brightness4 />
        ) : ternaryDarkMode === "light" ? (
          <Brightness7 />
        ) : (
          <BrightnessAuto />
        )}
      </IconButton>
      {/* CHANGE NavButtonGroup to NavTab : https://mui.com/material-ui/react-tabs/#nav-tabs */}
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="primary button group"
      >
        {/* // TODO: real Product href */}
        <Button href="/">Home</Button>
        <Button href="/docs">Docs</Button>
        {/* <Button href="/about">About</Button> */}
        {/* TODO: add something like help/contact/report here */}
      </ButtonGroup>
    </div>
  );
}
