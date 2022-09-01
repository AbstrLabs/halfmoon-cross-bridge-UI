// TODO: BAN-70
// TODO steps for Stepper should not index a function (for readability and performance).
// TODO Instead, create a Record<string,callable> to store the relation of step and function.
// TODO The stepper can use the Record<,> directly, instead of using `.action`

import {
  Box,
  LinearProgress,
  Modal,
  TextField,
  Typography,
  styled,
  Button,
} from "@mui/material";
import algosdk from "algosdk";
import React, { useCallback, useMemo, useState } from "react";
import { useCountdown } from "usehooks-ts";
import {
  connectAlgoWallet,
  authorizeBurnTransaction,
} from "../api-deps/algorand";
import { TxnType } from "../api-deps/config";
import { nearWallet, authorizeMintTransaction } from "../api-deps/near";

const DEFAULT_MINT_BENEFICIARY =
  "ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA";
const DEFAULT_MINT_AMOUNT = "1.3579";
const DEFAULT_BURN_BENEFICIARY = "abstrlabs-test.testnet";
const DEFAULT_BURN_AMOUNT = "1.2345";

// from backend
const AMOUNT_REGEX = /^[0-9]*\.?[0-9]{0,10}$/;
const ALGORAND_ADDR_REGEX = /^[2-79A-Z]{58}$/;
const NEAR_ADDR_REGEX = /^[0-9a-z][0-9a-z\-_]{2,64}.(testnet|mainnet)$/;

export function TxnPanel({ txnType }: { txnType: TxnType }) {
  // const panel = useContext(PanelContext) as PanelCtxInterface;

  // render page
  // STEP0: connect to wallet

  // STEP1: controlled by page state event
  // STEP2: Authorize transaction

  const isDev = process.env.NODE_ENV === "development";

  const isMint = useMemo(() => txnType === TxnType.MINT, [txnType]);
  const isBurn = useMemo(() => txnType === TxnType.BURN, [txnType]);
  const DEFAULT_BENEFICIARY = isMint
    ? DEFAULT_MINT_BENEFICIARY
    : DEFAULT_BURN_BENEFICIARY;
  const DEFAULT_AMOUNT = isMint ? DEFAULT_MINT_AMOUNT : DEFAULT_BURN_AMOUNT;
  const SENDING_UNIT = isMint ? "NEAR" : "goNEAR";
  const RECEIVING_UNIT = isMint ? "goNEAR" : "NEAR";
  const FEE = isMint ? "0.0%+1" : "0.2%+1";

  //form input
  const [beneficiary, setBeneficiary] = useState(
    isDev ? DEFAULT_BENEFICIARY : ""
  );
  const [amount, setAmount] = useState(isDev ? DEFAULT_AMOUNT : "");

  //form input valid
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(true);

  // connect and step function
  const [nearAcc, setNearAcc] = useState<string>(
    nearWallet.account().accountId ?? ""
  );
  const [algoAcc, setAlgoAcc] = useState<string>("");
  //todo: ref: rm`connectedAcc`;
  const connectedAcc = useMemo(
    () => (isMint ? nearAcc : algoAcc),
    [algoAcc, isMint, nearAcc]
  );

  // modal control
  const [isModalOpen, setModalOpen] = useState(false);

  //countdown
  const [algoTxnCountdown, { start: startCountdown, reset: resetCountdown }] =
    useCountdown({
      seconds: 150,
      interval: 100,
    });

  const startAlgoTxnCountdown = useCallback(() => {
    resetCountdown();
    setModalOpen(true);
    startCountdown();
  }, [resetCountdown, startCountdown]);

  // form check
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
    setIsBeneficiaryValid(validateAddress(beneficiary));
    setIsAmountValid(validateAmount(amount));
    if (!isBeneficiaryValid) {
      alert("Invalid address");
      return;
    }
    if (!isAmountValid) {
      alert("Invalid amount");
    }
  }, [
    amount,
    beneficiary,
    isAmountValid,
    isBeneficiaryValid,
    validateAddress,
    validateAmount,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signOutNearWallet = useCallback(() => {
    nearWallet.signOut();
  }, []);

  const connectNearWalletWrap = useCallback(async () => {
    if (nearWallet.isSignedIn()) {
      window.alert("you've signed in.");
    } else {
      nearWallet.requestSignIn("abstrlabs.testnet");
    }
    setNearAcc(nearWallet.account().accountId);
  }, []);
  const connectAlgoWalletWrap = useCallback(async () => {
    const accounts = await connectAlgoWallet();
    setAlgoAcc(accounts[0].address);
  }, []);

  // connect wallet
  const connectWallet = useCallback(async () => {
    // only blockchain == near
    if (isMint) connectNearWalletWrap();
    if (isBurn) connectAlgoWalletWrap();
  }, [connectAlgoWalletWrap, connectNearWalletWrap, isBurn, isMint]);

  const authorizeTxn = useCallback(
    async (/* amount: string, beneficiary: string */) => {
      if (isAmountValid && isBeneficiaryValid) {
        if (isMint) {
          await authorizeMintTransaction(amount, beneficiary);
        }
        if (isBurn) {
          await authorizeBurnTransaction(algoAcc, beneficiary, amount);
          startAlgoTxnCountdown();
        }
      }
    },
    [
      amount,
      beneficiary,
      isBurn,
      isMint,
      startAlgoTxnCountdown,
      algoAcc,
      isAmountValid,
      isBeneficiaryValid,
    ]
  );

  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText={`e.g. ${DEFAULT_BENEFICIARY}`}
          label={
            isMint
              ? "Beneficiary (Algorand public address)"
              : "Beneficiary (NEAR public address)"
          }
          fullWidth
          margin="normal"
          value={beneficiary}
          onChange={(e) => {
            const v = e.target.value;
            setBeneficiary?.(v);
            if (quickCheckAddress?.(v)) {
              setIsBeneficiaryValid?.(validateAddress?.(v) || v === "");
            }
          }}
          error={!isBeneficiaryValid}
          onBlur={(e) => {
            const v = e.target.value;
            if (v === "") return;
            setIsBeneficiaryValid?.(validateAddress?.(v) || v === "");
          }}
        />
        <Box display="flex">
          <TextField
            helperText={`e.g. ${DEFAULT_AMOUNT}, up to 10 decimals`}
            inputProps={{
              inputMode: "numeric",
              step: 0.000_000_000_1,
              pattern: "[0-9].*",
            }}
            error={!isAmountValid}
            label={`Sending Amount (${SENDING_UNIT})`}
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              setAmount?.(v);
              setIsAmountValid?.(validateAmount?.(v) || v === "");
            }}
          />
          <Box width="2rem" />
          <TextField
            label={`Receiving Amount (${RECEIVING_UNIT})`}
            helperText={`Fee: ${FEE}. Showing all decimals.`}
            fullWidth
            margin="normal"
            value={
              amount
                ? (Number(amount) * (isMint ? 1 : 0.998) - 1)
                    .toFixed(11)
                    .slice(0, -1)
                : ""
            }
            error={amount ? Number(amount) * (isMint ? 1 : 0.998) <= 1 : false}
            disabled
          />
        </Box>
      </FormWrap>
      <Box height="60px"></Box>
      (isMint?
      <Button color="inherit" onClick={connectWallet}>
        Connect Wallet
      </Button>
      :
      <Button color="inherit" onClick={connectWallet}>
        Connect Wallet
      </Button>
      )
      <Button color="inherit" onClick={validateForm}>
        Validate Form
      </Button>
      <Button color="inherit" onClick={authorizeTxn}>
        Authorize Transaction
      </Button>
      <Modal
        open={isModalOpen ? isModalOpen : false}
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
          <Typography variant="h6" component="h2" align="center">
            Waiting for Algorand Confirm
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Algorand blockchain needs around 15 seconds to confirm your
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
  width: "100%",
  padding: "1rem",
  backgroundColor: theme.palette.background.default,
  wrap: "pre-wrap",
}));
