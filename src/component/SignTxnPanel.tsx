import { Fingerprint } from "@mui/icons-material";
import {
  Box,
  Modal,
  TextField,
  Typography,
  styled,
  Button,
} from "@mui/material";
import algosdk from "algosdk";
import React, { useCallback, useMemo, useState } from "react";

import { TxnType, REX, DEFAULT, TokenId, FeeText, ReceivingPropotion } from "../api-deps/config";
import { authorizeBurnTransaction } from "../api-deps/algorand";
import { authorizeMintTransaction } from "../api-deps/near";

export function SendTokenPanel({ txnType }: { txnType: TxnType }) {

  const isMint = useMemo(() => txnType === TxnType.MINT, [txnType]);
  const isBurn = useMemo(() => txnType === TxnType.BURN, [txnType]);
  const DEFAULT_BENEFICIARY = isMint
    ? DEFAULT.DEFAULT_MINT_BENEFICIARY
    : DEFAULT.DEFAULT_BURN_BENEFICIARY;
  const DEFAULT_AMOUNT = isMint ? DEFAULT.DEFAULT_MINT_AMOUNT : DEFAULT.DEFAULT_BURN_AMOUNT;
  const SENDING_UNIT = isMint ? TokenId.NEAR : TokenId.goNEAR;
  const RECEIVING_UNIT = isMint ? TokenId.goNEAR : TokenId.NEAR;
  const FEE_TEXT = isMint ?  FeeText.MINT : FeeText.BURN;
  const USER_RECEIVING_PROPORTION = isMint ? ReceivingPropotion.MINT : ReceivingPropotion.BURN;

  //form input
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");

  //form input valid
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(true);

  // form check
  const quickCheckAddress = useCallback(
    (addr: string) =>
      (isMint && REX.ALGORAND_ADDR_REGEX.test(addr)) ||
      (isBurn && REX.NEAR_ADDR_REGEX.test(addr)),
    [isBurn, isMint]
  );

  const validateAddress = useCallback(
    (addr: string) =>
      quickCheckAddress(addr) &&
      ((isMint && algosdk.isValidAddress(addr)) || isBurn),
    [isBurn, isMint, quickCheckAddress]
  );

  const quickCheckAmount = useCallback(
    (amount: string) => REX.AMOUNT_REGEX.test(amount),
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

  const authorizeTxn = useCallback(
    async (/* amount: string, beneficiary: string */) => {
      if (isAmountValid && isBeneficiaryValid) {
        if (isMint) {
          await authorizeMintTransaction(amount, beneficiary);
        }
        if (isBurn) {
          await authorizeBurnTransaction(beneficiary, amount);
        }
      }
    },
    [amount, beneficiary, isBurn, isMint, isAmountValid, isBeneficiaryValid]
  );

  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          placeholder={`e.g. ${DEFAULT_BENEFICIARY}`}
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
            placeholder={`e.g. ${DEFAULT_AMOUNT}, up to 10 decimals`}
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
            helperText={`Fee: ${FEE_TEXT}. Showing all decimals.`}
            fullWidth
            margin="normal"
            value={
              amount
                ? (Number(amount) * USER_RECEIVING_PROPORTION - 1)
                    .toFixed(11)
                    .slice(0, -1)
                : ""
            }
            error={
              amount ? Number(amount) * USER_RECEIVING_PROPORTION <= 1 : false
            }
            disabled
          />
        </Box>
      </FormWrap>
      <Box height="60px"></Box>
      <Button color="inherit" onClick={validateForm}>
        Validate Form
      </Button>
      <Button
        color="inherit"
        onClick={authorizeTxn}
        variant="outlined"
        startIcon={<Fingerprint />}
      >
        Authorize Transaction
      </Button>
    </React.Fragment>
  );
}

/* ======== STYLED ======== */

const FormWrap = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "2px",
  width: "100%",
  padding: "1rem",
  wrap: "pre-wrap",
}));
