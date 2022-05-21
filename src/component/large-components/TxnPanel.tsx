import {
  Box,
  Step,
  StepButton,
  Stepper,
  TextField,
  styled,
} from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { authorizeMintTransaction, nearWallet } from "../utils/near";

window.Buffer = window.Buffer || require("buffer").Buffer; // for near connect wallet

export function MintPanel() {
  /* NEAR wallet */
  // only blockchain == near

  // This is in the official docs but why using await?
  // async function initNear() {
  //   const near = await nearAPI.connect({
  //     headers: {},
  //     keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  //     networkId: "testnet",
  //     nodeUrl: "https://rpc.testnet.near.org",
  //     walletUrl: "https://wallet.testnet.near.org",
  //   });
  //   return near;
  // }

  // const near = useMemo(async () => await initNear(), []);

  // If not signed in redirect to the NEAR wallet to sign in
  // keys will be stored in the BrowserLocalStorageKeyStore

  enum TTxnStepName {
    FORM = "Fill up the Form",
    WALLET = "Connect to Wallet",
    AUTH = "Authorize Mint Transaction",
  }

  const validateForm = useCallback(() => {
    alert("Form is valid (fake)");
    setActiveStep(1);
  }, []);
  const connectWallet = useCallback(() => {
    if (nearWallet.isSignedIn()) {
      const answer = window.confirm(
        "you've signed in, do you want to sign out?"
      );
      if (answer) {
        nearWallet.signOut();
      }
    } else {
      nearWallet.requestSignIn("abstrlabs.testnet");
    }
    setActiveStep(2);
  }, []);
  const authorizeTxn = useCallback(async () => {
    await authorizeMintTransaction(
      "1.357",
      "ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA"
    );
  }, []);

  type TStep = {
    stepId: number;
    icon: JSX.Element;
    action: (() => void) | (() => Promise<any>);
    isCompleted: boolean;
  };
  type TSteps = {
    [key in TTxnStepName]: TStep;
  };

  const steps: TSteps = useMemo(
    () => ({
      [TTxnStepName.FORM]: {
        stepId: 1,
        icon: <></>,
        action: validateForm,
        isCompleted: false,
      },
      [TTxnStepName.WALLET]: {
        stepId: 2,
        icon: <></>,
        action: connectWallet,
        isCompleted: false,
      },
      [TTxnStepName.AUTH]: {
        stepId: 3,
        icon: <></>,
        action: async () => {
          await authorizeTxn();
        },
        isCompleted: false,
      },
    }),
    [
      TTxnStepName.AUTH,
      TTxnStepName.FORM,
      TTxnStepName.WALLET,
      authorizeTxn,
      connectWallet,
      validateForm,
    ]
  );

  const [activeStep, setActiveStep] = React.useState<TStep["stepId"]>(0);

  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText="like ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA"
          id="mint_to"
          label="Beneficiary (Algorand public address)"
          fullWidth
          margin="normal"
          value="ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA"
        />
        <TextField
          helperText="like 1.357, up to 10 decimals"
          id="mint_amount"
          label="Amount (NEAR)"
          fullWidth
          margin="normal"
          value="1.357"
        />
      </FormWrap>
      <Box height="60px"></Box>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {Object.entries(steps).map(([stepName, stepObject]) => (
          <Step key={stepName} completed={stepObject.isCompleted}>
            <StepButton color="inherit" onClick={stepObject.action}>
              {stepName}
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
