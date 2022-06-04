import { Divider, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function DocsPage() {
  return (
    <Box lineHeight="1.6" my="2rem">
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
          },
        }}
      >
        {MARKDOWN_STR}
      </ReactMarkdown>
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

const MARKDOWN_STR = `
# Introduction to Algorand-NEAR-bridge Milestone 1

---
---

Based our estimation of the project time, we rescheduled the first milestone of Algorand-NEAR unidirectional bridge to be released with a centralized backend.

In this milestone, we will:

- Finish the economical model of the bridge
- Structural design and implementation of the bridge.
- Assess the target audience, goal, use cases of the expandable backend API.

We will deliver:

- A simple frontend (this repo) hosted with Amazon EC2 as the user interface.
- A backend (private for security reason) deployed on Amazon EC2 to handle the API calls.
- A demo video of the bridge in action.

## How to use our frontend

---

- Visit [Half Moon Cross](https://halfmooncross.com/)
- Select mint/burn function. (Mint = stake NEAR and get goNEAR; Burn = send goNEAR and get back the NEAR)
- Connect to the according wallet (NEAR wallet for Mint; My Algo wallet for Burn)
- Fill up the form (the frontend has a simple validate function)
- Authorize the transaction on the frontend.

## How to use our backend

---

- [Our API server](https://api.halfmooncross.com/) accepts the following API calls:
- POST method on endpoint [Algorand-NEAR](https://api.halfmooncross.com/algorand-near) with the \`ApiParam\` with Typescript interface definition:

  \`\`\`Typescript
  interface ApiParam {
    type: TxnType;
    from: string;
    txnId: string;
    to: string;
    amount: string;
  }

  // where TxnType is defined as

  enum TxnType {
  MINT = "MINT",
  BURN = "BURN",
  }
  \`\`\`

- GET method on the same endpoint. (upcoming)

## Further Missions

---

- A test toolkit to test the bridge.
`;
