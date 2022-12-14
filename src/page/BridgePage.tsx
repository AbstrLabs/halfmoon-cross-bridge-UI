import React, { useState, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Typography, styled, Box, Stepper, Step, StepLabel, StepContent, Button } from "@mui/material";

import { ConnectWallet } from "../component/ConnectWallet";
import { SendStep } from "../component/SendStep";

import { parseProcessUrlFromParam } from "../api-deps/api"
import { initContract } from "../api-deps/near";


export function BridgePage() {

  // init contract 
  let [near, setNear] = useState({ contract: {}, wallet: {} })

  let init = useCallback(async () => {
    let contractRes = await initContract()
    setNear({
      contract: contractRes.contract,
      wallet: contractRes.wallet
    })
    console.log(`near contract inited`)
  }, [])

  useEffect(() => {
    init()
  }, [])

  const url = new URL(window.location.href)
  const transactionHash = url.searchParams.get("transactionHashes") || ""

  const steps = [
    {
      label: 'Connect wallet',
      component: <ConnectWallet wallet={near.wallet} />,
    },
    {
      label: 'Bridge token',
      component: <SendStep contract={near.contract} wallet={near.wallet} />,
    }
  ];

  // step
  let currentStep = 0
  const [activeStep, setActiveStep] = React.useState(currentStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (transactionHash !== "") {
    console.log(transactionHash)
    return (<Navigate replace to={"/process?transactionHashes=" + transactionHash} />);
  }

  return (
    <BodyWrap>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontFamily: "Regular, sans-serif",
          fontSize: "60px",
          background: "linear-gradient(90.96deg, #7ee6a7 0.59%, #7ad6de 99.19%)",
          backgroundClip: "text",
          textFillColor: "transparent"
        }}
        marginY="1rem"
        align="center"
      >
        Cross-Chain Bridge
      </Typography>
      <Typography
        variant="h5"
        component="h5"
        sx={{
          fontFamily: "Regular, sans-serif",
          fontSize: "10px",
          color: "text.secondary"
        }}
        marginY="0.5rem"
        align="center"
      >
        Algorand - NEAR Bridge
      </Typography>
      <Box sx={{ maxWidth: "1000", width: '100%' }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
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
      </Box>
    </BodyWrap>
  );

}

/* ======== STYLED ======== */
const BodyWrap = styled("div")({
  flex: "1 1 auto",
  margin: "0 20px 40px",
  width: "max(60%,24rem)"
});
