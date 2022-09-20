import {
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  styled,
} from "@mui/material";
import { blue, green, grey, orange, yellow } from "@mui/material/colors";

import React from "react";
import { Router } from "./page/Router";
import { useTernaryDarkMode } from "usehooks-ts";

function App({ contract, currentUser, nearConfig, wallet }: any) {
  /* ======== MUI ======== */
  const { isDarkMode } = useTernaryDarkMode();

  const theme = React.useMemo(
    () => responsiveFontSizes(genThemeByMode(isDarkMode)),
    // TODO:WAIT: Fluid font sizes
    [isDarkMode]
  );
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
          <Router
            contract={contract}
            currentUser={currentUser}
            nearConfig={nearConfig}
            wallet={wallet}
          />
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
  backgroundColor: theme.palette.mode === "dark" ? "#0D1019" : "#e8feff50",
  backgroundImage: `url("${process.env.PUBLIC_URL}/svg/bcg-shapes.svg")`,
  minHeight: "100vh",
  maxWidth: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: theme.palette.text.primary,
  fontFamily: "Regular, sans-serif"
}));
