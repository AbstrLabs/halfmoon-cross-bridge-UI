import {
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  styled,
} from "@mui/material";
import { blue } from "@mui/material/colors";

import React, { useCallback, useEffect } from "react";
import { Router } from "./page/Router";
import { useTernaryDarkMode } from "usehooks-ts";
import { CONFIG } from "./api-deps/config"

async function checkApiVersion() {
  const res = await fetch(CONFIG.apiServerUrl + '/status');
  const resJson = await res.json();
  if (resJson.API_VERSION !== CONFIG.apiVersion) {
    window.alert(
      `API version mismatch, expected ${CONFIG.apiVersion}, got ${resJson.API_VERSION}`
    );
    throw new Error("API version mismatch");
    // console.error(`Failed to check API version. Error: ${err.message}`);
    // window.alert("Error happened on the server side, please contact us at contact@abstrlabs.com ")

  }
  else {
    console.log(`API version check passed. Current version: ${CONFIG.apiVersion}`)
  }
}

function App() {
  /* ======== MUI ======== */
  const { isDarkMode } = useTernaryDarkMode();

  const theme = React.useMemo(
    () => responsiveFontSizes(genThemeByMode(isDarkMode)),
    // TODO:WAIT: Fluid font sizes
    [isDarkMode]
  );
  /* ======== REACT ======== */

  let check = useCallback(async () => await checkApiVersion(), [])

  useEffect(() => {
    check()
  }, [])

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
          primary: { main: "#8DFFBA" },
          secondary: { main: blue["700"] },
          background: { default: "#0D1019" },
        }
        : {
          primary: { main: "#00bbba" },
          secondary: { main: blue["900"] },
          background: { default: "#e8feff50" },
        }),
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px var(--primary-weak) inset",
              WebkitTextFillColor: "var(--text-primary)",
              fontFamily: "Regular, sans-serif"
            },
          },
        },
      },
    },
    typography: {
      button: {
        textTransform: "none",
        fontFamily: "Regular, sans-serif"
      },
    },
  });
}

/* ======== STYLED ======== */
const AppWarp = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#0D1019" : "#8DFFBA10",
  backgroundImage: theme.palette.mode === "dark" ?
    `url("${process.env.PUBLIC_URL}/svg/bcg-shapes_dark.svg")`
    : `url("${process.env.PUBLIC_URL}/svg/bcg-shapes_light.svg")`,
  minHeight: "100vh",
  maxWidth: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: theme.palette.text.primary,
  fontFamily: "Regular, sans-serif"
}));
