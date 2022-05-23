import { Brightness4, Brightness7, BrightnessAuto } from "@mui/icons-material";
import { Button, ButtonGroup, IconButton } from "@mui/material";

import { useTernaryDarkMode } from "usehooks-ts";
import { Link } from "react-router-dom";

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
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="primary button group"
      >
        {/* {process.env.NODE_ENV === "development" && (
          <Button onClick={test}>Test</Button>
        )} */}
        {/* // TODO: real Product href */}
        <Link to="/"><Button>Home</Button></Link>
        <Link to="/docs"><Button>Docs</Button></Link>
        <Link to="/result"><Button>Result</Button></Link>
        <Link to="/about"><Button>About</Button></Link>
      </ButtonGroup>
    </div>
  );
}
