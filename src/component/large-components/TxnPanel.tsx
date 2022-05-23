import {
  Box,
  LinearProgress,
  Modal,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { authorizeBurnTransaction, connectToMyAlgo } from "../utils/algorand";
import { authorizeMintTransaction, nearWallet } from "../utils/near";

import { TxnType } from "../..";
import algosdk from "algosdk";
import { useCountdown } from "usehooks-ts";

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
  const SENDING_UNIT = isMint ? "NEAR" : "goNEAR";
  const RECEIVING_UNIT = isMint ? "goNEAR" : "NEAR";
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [isStepsFinished, setStepsFinished] = useState([false, false, false]);
  const updateStepsFinished = useCallback((pos: 0 | 1 | 2, newVal: boolean) => {
    setStepsFinished((isStepsFinished) => {
      const newStepsFinished = [...isStepsFinished];
      newStepsFinished[pos] = newVal;
      return newStepsFinished;
    });
  }, []);
  // step1
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
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

  const [algoTxnCountdown, { start: startCountdown, reset: resetCountdown }] =
    useCountdown({
      seconds: 100,
      interval: 100,
    });

  const startAlgoTxnCountdown = useCallback(() => {
    resetCountdown();
    setModalOpen(true);
    startCountdown();
  }, [resetCountdown, startCountdown]);

  const validateForm = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      const c = window.confirm("Fill with test values?");
      if (c) {
        setBeneficiary(DEFAULT_BENEFICIARY);
        setAmount(DEFAULT_AMOUNT);
      }
    }

    if (!isBeneficiaryValid) {
      updateStepsFinished(0, false);
      alert("Invalid address");
      return;
    }
    if (!isAmountValid) {
      updateStepsFinished(0, false);
      alert("Invalid amount");
      return;
    }
    updateStepsFinished(0, true);
  }, [
    DEFAULT_AMOUNT,
    DEFAULT_BENEFICIARY,
    isAmountValid,
    isBeneficiaryValid,
    updateStepsFinished,
  ]);
  const connectWallet = useCallback(async () => {
    // only blockchain == near
    if (isMint) {
      if (nearWallet.isSignedIn()) {
        updateStepsFinished(1, true);
        const answer = window.confirm(
          "you've signed in, do you want to sign out?"
        );
        if (answer) {
          nearWallet.signOut();
          updateStepsFinished(1, false);
        }
      } else {
        nearWallet.requestSignIn("abstrlabs.testnet");
        updateStepsFinished(1, true);
      }
    }
    if (isBurn) {
      await connectToMyAlgo();
      updateStepsFinished(1, true);
    }
    updateStepsFinished(1, true);
  }, [isBurn, isMint, updateStepsFinished]);
  const authorizeTxn = useCallback(
    async (/* amount: string, beneficiary: string */) => {
      if (isMint) {
        await authorizeMintTransaction(amount, beneficiary);
      }
      if (isBurn) {
        await authorizeBurnTransaction(beneficiary, amount);
        startAlgoTxnCountdown();
      }
    },
    [amount, beneficiary, isBurn, isMint, startAlgoTxnCountdown]
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

  useEffect(() => {}, []);
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
        <Box display="flex">
          <TextField
            helperText={`like ${DEFAULT_AMOUNT}, up to 10 decimals`}
            inputProps={{
              inputMode: "numeric",
              step: 0.000_000_000_1,
              pattern: "[0-9].*",
            }}
            error={!isAmountValid}
            id="mint_amount"
            label={`Sending Amount (${SENDING_UNIT})`}
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              setAmount(v);
              setIsAmountValid(validateAmount(v));
            }}
          />
          <Box width="2rem" />
          <TextField
            helperText={`like ${DEFAULT_AMOUNT}, up to 10 decimals`}
            inputProps={{
              inputMode: "numeric",
              step: 0.000_000_000_1,
              pattern: "[0-9].*",
            }}
            id="mint_amount"
            label={`Receiving Amount (${RECEIVING_UNIT})`}
            fullWidth
            margin="normal"
            value={(Number(amount) * (isMint ? 1 : 0.998) - 1).toFixed(10)}
            disabled
          />
        </Box>
      </FormWrap>

      <Box height="60px"></Box>

      <Stepper
        nonLinear
        activeStep={isStepsFinished.findIndex((x) => !x)}
        alternativeLabel
      >
        {Object.entries(steps).map(([stepName, stepObject]) => (
          <Step key={stepName} completed={isStepsFinished[stepObject.stepId]}>
            <StepButton
              color="inherit"
              onClick={stepObject.action}
              disabled={
                stepObject.stepId > isStepsFinished.findIndex((x) => !x)
              }
            >
              {stepName}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setModalOpen(true);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            color: "text.primary",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: "0px 0px 18px 12px #7f7f7f50",
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            Waiting for Algorand Confirm
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Algorand blockchain needs around 10 seconds to confirm your
            transaction. Please wait for{" "}
            {(algoTxnCountdown / 10).toFixed(1) + " "}
            more second(s).
          </Typography>
          <Box height="1rem"></Box>
          <LinearProgress variant="determinate" value={algoTxnCountdown} />
        </Box>
      </Modal>
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
