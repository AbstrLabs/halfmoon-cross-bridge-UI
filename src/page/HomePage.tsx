import React from 'react';
import { Typography, styled, Box, Stepper, Step, StepLabel, StepContent, Button, Paper } from "@mui/material";

import {Bridge} from "../component/Bridge" 
import { ConnectWallet } from "../component/ConnectWallet";

const steps = [
  {
    label: 'Connect wallet',
    component: <ConnectWallet />,
  },
  {
    label: 'Fill bridge form',
    component: <Bridge />,
  },
  {
    label: 'Confirm the transaction',
    component: <>Confirm</>,
  },
];

export function HomePage() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <BodyWrap>
      <Typography
        variant="h2"
        component="h2"
        sx={{ 
          fontFamily: "Regular, sans-serif",
          fontSize: "72px",
          background: "linear-gradient(90.96deg, #8DFFBA 0.59%, #8CF3FC 99.19%)",
          backgroundClip: "text",
          textFillColor: "transparent" }}
        marginY="2rem"
        align="center"
      >
        Cross-Chain Bridge
      </Typography>
      <Typography
          variant="h5"
          component="h5"
          sx={{ 
            fontFamily: "Regular, sans-serif",
            fontSize: "12px",
            color:"#fff" }}
          marginY="2rem"
          align="center"
        >
          Algorand - NEAR Bridge
      </Typography>
         <Box sx={{ maxWidth:  1000 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step, make sure everything is correct!</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <div>{step.component}</div>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
    </BodyWrap>
  );
}

/* ======== STYLED ======== */
const BodyWrap = styled("div")({
  flex: "1 1 auto",
  margin: "0 20px 40px",
  width: "max(60%,24rem)",
});
