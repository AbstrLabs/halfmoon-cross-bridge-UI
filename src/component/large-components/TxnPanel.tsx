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

import { TxnType } from "../..";

window.Buffer = window.Buffer || require("buffer").Buffer; // for near connect wallet

const DEFAULT_MINT_BENEFICIARY =
  "ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA";
const DEFAULT_MINT_AMOUNT = "1.357";
const DEFAULT_BURN_BENEFICIARY = "abstrLabs-test.testnet";
const DEFAULT_BURN_AMOUNT = "1.234";

export function TxnPanel({ txnType }: { txnType: TxnType }) {
  enum TTxnStepName {
    FORM = "Fill up the Form",
    WALLET = "Connect to Wallet",
    AUTH = "Authorize Mint Transaction",
  }

  const DEFAULT_BENEFICIARY =
    txnType === TxnType.MINT
      ? DEFAULT_MINT_BENEFICIARY
      : DEFAULT_BURN_BENEFICIARY;
  const DEFAULT_AMOUNT =
    txnType === TxnType.MINT ? DEFAULT_MINT_AMOUNT : DEFAULT_BURN_AMOUNT;

  const validateForm = useCallback(() => {
    alert("Form is valid (fake)");
    setActiveStep(1);
  }, []);
  const connectWallet = useCallback(() => {
    // only blockchain == near
    if (txnType === TxnType.MINT) {
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
    }

    if (txnType === TxnType.BURN) {
    }
    setActiveStep(2);
  }, [txnType]);
  const authorizeTxn = useCallback(async () => {
    if (txnType === TxnType.MINT) {
      await authorizeMintTransaction(DEFAULT_AMOUNT, DEFAULT_BENEFICIARY);
    }
  }, [txnType, DEFAULT_BENEFICIARY, DEFAULT_AMOUNT]);

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
          helperText={`like ${DEFAULT_BENEFICIARY}`}
          id="mint_to"
          label="Beneficiary (Algorand public address)"
          fullWidth
          margin="normal"
          value={DEFAULT_BENEFICIARY}
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
