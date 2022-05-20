import { styled, useTheme } from "@mui/material";

import { Link } from "react-router-dom";
import { Variant } from "@mui/material/styles/createTypography";

interface LogoProps {
  style?: React.CSSProperties;
  variant?: Variant;
}

export function Logo(
  { style, variant = "h2", ...props }: LogoProps = { variant: "h2" }
): JSX.Element {
  const theme = useTheme();
  const variantFontSize = {
    fontSize: theme.typography[variant].fontSize,
  };

  return (
    <StyledLink to="/">
      <div style={{ ...variantFontSize, ...style }}>
        🌓✝️🌗 Half Moon Cross
      </div>
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
