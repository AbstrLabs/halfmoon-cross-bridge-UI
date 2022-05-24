import {
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  styled,
} from "@mui/material";
import { grey, orange, yellow } from "@mui/material/colors";

import React from "react";
import { Router } from "./page/Router";
import { useTernaryDarkMode } from "usehooks-ts";

function App() {
  /* ======== MUI ======== */
  const { isDarkMode } = useTernaryDarkMode();

  const theme = React.useMemo(
    () => responsiveFontSizes(genThemeByMode(isDarkMode)),
    // TODO:WAIT: Fluid font sizes
    [isDarkMode]
  );

  console.log("updated on @2022-05-25"); // to test host

  /* ======== REACT ======== */
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            ":root": {
              "--primary-weak":
                theme.palette.primary[theme.palette.mode as "dark" | "light"],
              "--text-primary": theme.palette.text.primary,
            },
          }}
        />
        <AppWarp>
          <Router />
        </AppWarp>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
function genThemeByMode(isDarkMode: boolean): any {
  return createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      ...(isDarkMode
        ? {
            primary: { main: yellow["A700"] },
            secondary: { main: orange["A700"] },
            background: { default: grey["900"] },
          }
        : {
            primary: { main: yellow["700"] },
            secondary: { main: orange["700"] },
            background: { default: grey["100"] },
          }),
    },
    components: {
      /* This is nor working.
      /* MuiTypography: {
        styleOverrides: {
          h1: { "&.MuiTypography-gutterBottom": { marginBottom: 6.25 } },
        },
      }, */
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px var(--primary-weak) inset",
              WebkitTextFillColor: "var(--text-primary)",
              // "-webkit-box-shadow": "0 0 0 100px var(--primary-weak) inset",
              // "-webkit-text-fill-color": "var(--text-primary)",
            },
          },
        },
      },
    },
    typography: {
      button: {
        textTransform: "none",
      },
    },
  });
}

/* ======== STYLED ======== */
const AppWarp = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#080808" : "#fff",
  minHeight: "100vh",
  maxWidth: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: theme.palette.text.primary,
}));
