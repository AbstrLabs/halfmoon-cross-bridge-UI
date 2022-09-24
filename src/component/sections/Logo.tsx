import { styled } from "@mui/material";

import { Link } from "react-router-dom";
import { Variant } from "@mui/material/styles/createTypography";
import { useTernaryDarkMode } from "usehooks-ts";

interface LogoProps {
  style?: React.CSSProperties;
  variant?: Variant;
}

export function Logo(
  { style, ...props }: LogoProps = { variant: "h2" }
): JSX.Element {
  const { isDarkMode } = useTernaryDarkMode();

  return (
    <StyledLink to="/" sx={{ float: "left" }}>
      {isDarkMode ? (
        <img
          style={{ ...style }}
          alt="logo-dark"
          src={process.env.PUBLIC_URL + "/svg/logo-dark.svg"}
          title="halfmooncross.com"
          {...props}
        />
      ) : (
        <img
          style={{ ...style }}
          alt="logo-light"
          src={process.env.PUBLIC_URL + "/svg/logo-light.svg"}
          title="halfmooncross.com"
          {...props}
        />
      )}
    </StyledLink>
  );
}

/* ======== STYLED ======== */
const StyledLink = styled(Link)({
  color: "inherit",
  textDecoration: "none",
  "& :visited": {
    color: "inherit",
  },
});
