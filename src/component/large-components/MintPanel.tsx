import {
  Box,
  Step,
  StepButton,
  Stepper,
  TextField,
  styled,
} from "@mui/material";

import React from "react";

export function MintPanel() {
  const steps = [
    "Fill up the Form",
    "Connect to Wallet",
    "Authorize Mint Transaction",
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completed, setCompleted] = React.useState([false, false, false]);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText="like 1.357, up to 10 decimals"
          id="mint_to"
          label="Beneficiary (Algorand public address)"
          fullWidth
          margin="normal"
        />
        <TextField
          helperText="like ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA"
          id="mint_amount"
          label="Amount (NEAR)"
          margin="normal"
          fullWidth
        />
      </FormWrap>
      <Box height="60px"></Box>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index: number) => (
          <Step key={label} completed={completed[index]}>
            <StepButton
              color="inherit"
              onClick={handleStep(index)}
              // style={{ orientation: "vertical" }}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </React.Fragment>
  );
}

/* ======== STYLED ======== */

const FormWrap = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "20px 0 0",
  // display: "flex",
  maxWidth: "100%",
  padding: "1rem",
  backgroundColor: theme.palette.background.default,
  wrap: "pre-wrap",
}));
