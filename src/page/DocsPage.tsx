import { Divider, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import docsPath from "./docs.md"

export function DocsPage() {
  const [docs, setDocs] = useState("")
  useEffect(() => {
    fetch(docsPath).then((response) => response.text()).then((text) => {
      setDocs(text)
    })
  }, [])

  return (
    <Box lineHeight="1.6" my="2rem" sx={{ margin: "20px" }}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <Typography variant="h3" {...props} />,
          h2: ({ node, ...props }) => <Typography variant="h4" {...props} />,
          hr: ({ node, ...props }) => (
            <Divider sx={{ marginY: 1 }} {...props} />
          ),
          a: ({ node, ...props }) => <Link {...props} />,
          code: ({ node, inline, className, children, ...props }) => {
            return !inline ? (
              <SyntaxHighlighterWithA11yDarkStyleForTs
                children={children}
                props={props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}

      >
        {docs}
      </ReactMarkdown>
      <Box sx={{ marginTop: "10px", color: "secondary.main", fontSize: "1.5rem" }}>
        Hope you enjoy using this platform to explore more possibilities for your DeFi jouney.
      </Box>
      <Box sx={{ marginTop: "10px", color: "info.main" }}>
        If you have any questions, please contact us at contact@abstrlabs.com.
      </Box>
      {/* <Footer /> */}
    </Box>
  );
}

function SyntaxHighlighterWithA11yDarkStyleForTs({
  children,
  props,
}: {
  children: React.ReactNode;
  props: any;
}) {
  return (
    <SyntaxHighlighter
      style={a11yDark}
      children={String(children).replace(/\n$/, "")}
      language={"typescript"}
      PreTag="div"
      {...props}
    />
  );
}
