import React from 'react';
import { Typography, styled, Box, Stepper, Step, StepLabel, StepContent, Button, Paper } from "@mui/material";

import { ConnectWallet } from "../component/ConnectWallet";
import { SendStep } from "../component/SendStep";
import { SignStep } from '../component/SignStep';

export function HomePage({ contract, currentUser }: any) {
  // transaction hash
  // /?transactionHashes=AfKuCQKP78691ygVwwhkKjuW982NSsE3P6AhR2SjYykS
  const url = new URL(window.location.href)
  const transactionHash = url.searchParams.get("transactionHashes") || ""

  const steps = [
    {
      label: 'Connect wallet',
      component: <ConnectWallet />,
    },
    {
      label: 'Bridge token',
      component: <SendStep contract={contract} currentUser={currentUser} />,
    },
    {
      label: 'Confirm the transaction',
      component: <SignStep transactionHash={transactionHash} currentUser={currentUser} />,
    },
  ];

  // step
  let currentStep = 0
  if (currentUser !== undefined && localStorage.getItem("Algorand") !== null) currentStep = 1
  if (transactionHash !== "") currentStep = 2
  const [activeStep, setActiveStep] = React.useState(currentStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    contract.get_request_status({ account_id: currentUser }).then((res: any) => {
      console.log(res)
    })
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
          textFillColor: "transparent"
        }}
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
          color: "#fff"
        }}
        marginY="2rem"
        align="center"
      >
        Algorand - NEAR Bridge
      </Typography>
      <Box sx={{ maxWidth: 1000 }}>
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
                    {index === steps.length - 1 ? null :
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >Continue
                      </Button>
                    }
                    {index !== 0 &&
                      <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    }

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
