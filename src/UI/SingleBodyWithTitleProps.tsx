import { Divider, Typography, styled } from "@mui/material";

interface SingleBodyWithTitleProps
  extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
  > {
  title: string;
  children: React.ReactNode;
}

export function SingleBodyWithTitle({
  title,
  children,
  ...props
}: SingleBodyWithTitleProps) {
  return (
    <SingleBodyWrap {...props}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontSize: "1rem", fontWeight: 800 }}
      >
        {title}
      </Typography>
      <Divider sx={{ mt: 1, mb: 5 }} />
      {children}
    </SingleBodyWrap>
  );
}

/* ======== STYLED ======== */
const SingleBodyWrap = styled("div")({
  margin: "2rem auto 4rem",
  maxWidth: "48rem",
});