import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  TextField,
  styled,
  Button
} from "@mui/material";
import React, { useCallback, useState } from "react";

import { REX, DEFAULT, TokenId, FeeText, ReceivingPropotion, FeePortion } from "../api-deps/config";
import { requestSignGoNearTxn } from "../api-deps/algorand";


export function SendTxnBurnPanel({ wallet }: any) {
  const DEFAULT_BENEFICIARY = DEFAULT.DEFAULT_BURN_BENEFICIARY

  const DEFAULT_AMOUNT = DEFAULT.DEFAULT_BURN_AMOUNT;
  const SENDING_UNIT = TokenId.goNEAR;
  const RECEIVING_UNIT = TokenId.NEAR;
  const FEE_TEXT = FeeText.BURN;
  const USER_RECEIVING_PROPORTION = ReceivingPropotion.BURN;

  let ALGOaccount = localStorage.getItem("Algorand") || ""

  //form input
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("");

  //form input valid
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(true);

  // form check
  const validateAddress = useCallback(
    (addr: string) => REX.NEAR_ADDR_REGEX.test(addr),
    []
  );

  const quickCheckAmount = useCallback(
    (amount: string) => REX.AMOUNT_REGEX.test(amount),
    []
  );

  const validateAmount = useCallback(
    (amount: string) => quickCheckAmount(amount),
    [quickCheckAmount]
  );

  // send token
  const authorizeTxn = useCallback(
    async (/* amount: string */) => {
      setIsBeneficiaryValid(validateAddress(beneficiary));
      setIsAmountValid(validateAmount(amount));
      if (!isBeneficiaryValid || beneficiary === "") {
        alert("Invalid address");
        return;
      }
      if (!isAmountValid || amount === "") {
        alert("Invalid amount");
      }
      if (isBeneficiaryValid && isAmountValid && beneficiary !== "" && amount !== "") {
        let res = await requestSignGoNearTxn(ALGOaccount, amount, beneficiary);
        if (typeof (res) === "string") {
          let transactionHashes = res
          let url = new URL(window.location.href)
          url.searchParams.set("transactionHashes", transactionHashes);
          window.location.replace(url)
        }
        else {
          console.log(res)
        }
      }
    },
    [amount, isAmountValid, ALGOaccount, beneficiary, isBeneficiaryValid]
  );

  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText={`e.g. ${wallet.account().accountId ? wallet.account().accountId : DEFAULT_BENEFICIARY}`}
          label={
            "Beneficiary (Algorand public address)"
          }
          fullWidth
          margin="normal"
          value={beneficiary}
          onChange={(e) => {
            const v = e.target.value;
            setBeneficiary?.(v);
            if (validateAddress?.(v)) {
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
            label={`expected receiving amount (${RECEIVING_UNIT})`}
            helperText={`Fee: ${FEE_TEXT}. Showing all decimals.`}
            fullWidth
            margin="normal"
            value={
              amount
                ? (Number(amount) * USER_RECEIVING_PROPORTION - FeePortion.BURN)
                  .toFixed(11)
                  .slice(0, -1)
                : ""
            }
            error={
              amount ? Number(amount) * USER_RECEIVING_PROPORTION <= 1 : false
            }
            variant="standard"
            disabled
          />
        </Box>
        <Button
          color="inherit"
          onClick={authorizeTxn}
          variant="outlined"
          endIcon={<SendIcon />}>
          Validate and Confirm
        </Button>
      </FormWrap>
    </React.Fragment>
  );
}

/* ======== STYLED ======== */

const FormWrap = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "2px",
  width: "100%",
  padding: "0",
  wrap: "pre-wrap",
}));
