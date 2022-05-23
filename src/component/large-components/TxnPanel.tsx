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

enum TTxnStepName {
  FORM = "Fill up the Form",
  WALLET = "Connect to Wallet",
  AUTH = "Authorize Mint Transaction",
}
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
  const isMint = useMemo(() => txnType === TxnType.MINT, [txnType]);
  const isBurn = useMemo(() => txnType === TxnType.BURN, [txnType]);

  const DEFAULT_BENEFICIARY = isMint
    ? DEFAULT_MINT_BENEFICIARY
    : DEFAULT_BURN_BENEFICIARY;
  const DEFAULT_AMOUNT = isMint ? DEFAULT_MINT_AMOUNT : DEFAULT_BURN_AMOUNT;

  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [isStepsFinished, setStepsFinished] = useState([false, false, false]);

  // step1
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(true);

  const quickCheckAddress = useCallback(
    (addr: string) =>
      (isMint && ALGORAND_ADDR_REGEX.test(addr)) ||
      (isBurn && NEAR_ADDR_REGEX.test(addr)),
    [isBurn, isMint]
  );
  const validateAddress = useCallback(
    (addr: string) =>
      quickCheckAddress(addr) &&
      ((isMint && algosdk.isValidAddress(addr)) || isBurn),
    [isBurn, isMint, quickCheckAddress]
  );

  const quickCheckAmount = useCallback(
    (amount: string) => AMOUNT_REGEX.test(amount),
    []
  );
  const validateAmount = useCallback(
    (amount: string) => quickCheckAmount(amount),
    [quickCheckAmount]
  );

  const validateForm = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      const c = window.confirm("Fill with test values?");
      if (c) {
        setBeneficiary(DEFAULT_BENEFICIARY);
        setAmount(DEFAULT_AMOUNT);
      }
      setStepsFinished({ ...isStepsFinished, 0: true });
      // TODO: add a watcher for setActiveStep (use memo)
      return;
    }

    if (!isBeneficiaryValid) {
      setStepsFinished({ ...isStepsFinished, 0: false });
      alert("Invalid address");
      return;
    }
    if (!isAmountValid) {
      setStepsFinished({ ...isStepsFinished, 0: false });
      alert("Invalid amount");
      return;
    }
    setStepsFinished({ ...isStepsFinished, 0: true });
  }, [
    DEFAULT_AMOUNT,
    DEFAULT_BENEFICIARY,
    isAmountValid,
    isBeneficiaryValid,
    isStepsFinished,
  ]);
  const connectWallet = useCallback(async () => {
    // only blockchain == near
    if (isMint) {
      if (nearWallet.isSignedIn()) {
        const answer = window.confirm(
          "you've signed in, do you want to sign out?"
        );
        if (answer) {
          nearWallet.signOut();
          setStepsFinished({ ...isStepsFinished, 1: false });
        }
      } else {
        nearWallet.requestSignIn("abstrlabs.testnet");
        setStepsFinished({ ...isStepsFinished, 1: true });
      }
    }
    if (isBurn) {
      await connectToMyAlgo();
      setStepsFinished({ ...isStepsFinished, 1: true });
    }
    setStepsFinished({ ...isStepsFinished, 1: true });
  }, [isBurn, isMint, isStepsFinished]);
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

    [authorizeTxn, connectWallet, validateForm]
  );

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
          onChange={(e) => {
            const v = e.target.value;
            setBeneficiary(v);
            if (quickCheckAddress(v)) {
              setIsBeneficiaryValid(validateAddress(v));
            }
          }}
          error={!isBeneficiaryValid}
          onBlur={(e) => {
            const v = e.target.value;
            if (v === "") return;
            setIsBeneficiaryValid(validateAddress(v) || v === "");
          }}
        />
        <TextField
          helperText={`like ${DEFAULT_AMOUNT}, up to 10 decimals`}
          inputProps={{
            inputMode: "numeric",
            step: 0.000_000_000_1,
            pattern: "[0-9].*",
          }}
          error={!isAmountValid}
          id="mint_amount"
          label="Amount (NEAR)"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => {
            const v = e.target.value;
            setAmount(v);
            setIsAmountValid(validateAmount(v));
          }}
        />
      </FormWrap>

      <Box height="60px"></Box>

      <Stepper
        nonLinear
        activeStep={isStepsFinished.findIndex((x) => x) + 1}
        alternativeLabel
      >
        {Object.entries(steps).map(([stepName, stepObject]) => (
          <Step key={stepName} completed={isStepsFinished[stepObject.stepId]}>
            <StepButton
              color="inherit"
              onClick={stepObject.action}
              disabled={
                stepObject.stepId > isStepsFinished.findIndex((x) => x) + 1
              }
            >
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
