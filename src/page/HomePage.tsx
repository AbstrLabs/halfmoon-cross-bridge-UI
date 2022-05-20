import {
  Box,
  Step,
  StepButton,
  Stepper,
  Tab,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Download, Upload } from "@mui/icons-material";
import React, { SyntheticEvent, useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export function HomePage() {
  /* ======== MUI ======== */
  enum TabName {
    MINT = "MINT",
    BURN = "BURN",
  }
  const [currentTab, setCurrentTab] = useState<TabName>(TabName.MINT);
  const steps = [
    "Fill up the Form",
    "Connect to Wallet",
    "Authorize Mint Transaction",
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completed, setCompleted] = React.useState([false, false, false]);

  const handleTabChange = useCallback(
    (event: SyntheticEvent<Element, Event>, tabName: TabName) => {
      setCurrentTab(tabName);
    },
    []
  );
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <BodyWrap>
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontSize: "1rem", fontWeight: 800 }}
        margin="2rem auto 4rem"
        align="center"
      >
        Algorand - Near Bridge
      </Typography>
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} centered>
            <Tab
              icon={<Download />}
              label={TabName.MINT}
              value={TabName.MINT}
            />
            <Tab icon={<Upload />} label={TabName.BURN} value={TabName.BURN} />
          </TabList>
        </Box>
        <TabPanel value={TabName.MINT}>
          <CardsWrap>
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
          </CardsWrap>
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
        </TabPanel>
        <TabPanel value={TabName.BURN}>BURN TO</TabPanel>
      </TabContext>
    </BodyWrap>
  );
}

/* ======== STYLED ======== */
const BodyWrap = styled("div")({
  flex: "1 1 auto",
  margin: "0 20px 40px",
});
const CardsWrap = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "20px 0 0",
  // display: "flex",
  maxWidth: "100%",
  padding: "1rem",
  backgroundColor: theme.palette.background.default,
  wrap: "pre-wrap",
}));
