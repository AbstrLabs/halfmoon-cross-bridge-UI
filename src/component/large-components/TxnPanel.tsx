import {
  Box,
  Step,
  StepButton,
  Stepper,
  TextField,
  styled,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { authorizeBurnTransaction, connectToMyAlgo } from "../utils/algorand";
import { authorizeMintTransaction, nearWallet } from "../utils/near";

import { TxnType } from "../..";
import algosdk from "algosdk";

const DEFAULT_MINT_BENEFICIARY =
  "ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA";
const DEFAULT_MINT_AMOUNT = "1.357";
const DEFAULT_BURN_BENEFICIARY = "abstrlabs-test.testnet";
const DEFAULT_BURN_AMOUNT = "1.234";

// from backend
const AMOUNT_REGEX = /^[0-9]*\.?[0-9]{0,10}$/;
const ALGORAND_ADDR_REGEX = /^[2-79A-Z]{58}$/;
const NEAR_ADDR_REGEX = /^[0-9a-z][0-9a-z\-_]{2,64}.(testnet|mainnet)$/;

export function TxnPanel({ txnType }: { txnType: TxnType }) {
  enum TTxnStepName {
    FORM = "Fill up the Form",
    WALLET = "Connect to Wallet",
    AUTH = "Authorize Mint Transaction",
  }

  const isMint = useMemo(() => txnType === TxnType.MINT, [txnType]);
  const isBurn = useMemo(() => txnType === TxnType.BURN, [txnType]);

  const DEFAULT_BENEFICIARY = isMint
    ? DEFAULT_MINT_BENEFICIARY
    : DEFAULT_BURN_BENEFICIARY;
  const DEFAULT_AMOUNT = isMint ? DEFAULT_MINT_AMOUNT : DEFAULT_BURN_AMOUNT;

  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");

  const quickCheckAddress = useCallback(
    (addr: string) =>
      (isMint && addr.match(ALGORAND_ADDR_REGEX) === null) ||
      (isBurn && addr.match(NEAR_ADDR_REGEX) === null),
    [isBurn, isMint]
  );
  // {
  //   if (isMint) {
  //     if (addr.match(ALGORAND_ADDR_REGEX) === null) {
  //       return false;
  //     }
  //   }
  //   if (isBurn) {
  //     if (addr.match(NEAR_ADDR_REGEX) === null) {
  //       return false;
  //     }
  //     return true; // i don't know how to check
  //   }
  //   return false;
  // }

  const validateAddress = useCallback(
    (addr: string) => (isMint && algosdk.isValidAddress(addr)) || isBurn,
    [isBurn, isMint]
  );
  // {
  //   if (isMint) {
  //     return algosdk.isValidAddress(addr);
  //   }
  //   if (isBurn) {
  //     return true;
  //   }
  //   return false;
  // },

  const validateForm = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      const c = window.confirm("Fill with test values?");
      if (c) {
        setBeneficiary(DEFAULT_BENEFICIARY);
        setAmount(DEFAULT_AMOUNT);
      }
    }
    if (!validateAddress(beneficiary)) {
      setActiveStep(0);
      alert("Invalid address");
      return;
    }
    setActiveStep(1);
  }, [DEFAULT_AMOUNT, DEFAULT_BENEFICIARY, beneficiary, validateAddress]);
  const connectWallet = useCallback(async () => {
    // only blockchain == near
    if (isMint) {
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
    if (isBurn) {
      await connectToMyAlgo();
    }

    if (isBurn) {
    }
    setActiveStep(2);
  }, [isBurn, isMint]);
  const authorizeTxn = useCallback(
    async (/* amount: string, beneficiary: string */) => {
      if (isMint) {
        await authorizeMintTransaction(amount, beneficiary);
      }
      if (isBurn) {
        await authorizeBurnTransaction(beneficiary, amount);
      }
    },
    [amount, beneficiary, isBurn, isMint]
  );

  type TStep = {
    stepId: number;
    icon: JSX.Element;
    action: (() => void) | (() => Promise<any>);
  };
  type TSteps = {
    [key in TTxnStepName]: TStep;
  };

  const steps: TSteps = useMemo(
    () => ({
      [TTxnStepName.FORM]: {
        stepId: 0,
        icon: <></>,
        action: validateForm,
      },
      [TTxnStepName.WALLET]: {
        stepId: 1,
        icon: <></>,
        action: async () => await connectWallet(),
      },
      [TTxnStepName.AUTH]: {
        stepId: 2,
        icon: <></>,
        action: async () => await authorizeTxn(),
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
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          error={!quickCheckAddress(beneficiary)}
        />
        <TextField
          helperText={`like ${DEFAULT_AMOUNT}, up to 10 decimals`}
          inputProps={{
            inputMode: "numeric",
            step: 0.000_000_000_1,
            pattern: "[0-9].*",
          }}
          error={amount.match(AMOUNT_REGEX) === null}
          id="mint_amount"
          label="Amount (NEAR)"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormWrap>
      <Box height="60px"></Box>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {Object.entries(steps).map(([stepName, stepObject]) => (
          <Step key={stepName} completed={stepObject.stepId < activeStep}>
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
  width: "100%",
  padding: "1rem",
  backgroundColor: theme.palette.background.default,
  wrap: "pre-wrap",
}));
