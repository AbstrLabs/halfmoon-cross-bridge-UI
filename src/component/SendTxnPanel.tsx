import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  TextField,
  styled,
  Button,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";

import { TxnType, REX, DEFAULT, TokenId, FeeText, ReceivingPropotion } from "../api-deps/config";
import { requestSignGoNearTxn } from "../api-deps/algorand";
import { requestSendNearTokenTxn } from "../api-deps/near";

export function SendTxnPanel({ txnType }: { txnType: TxnType }) {

  const isMint = useMemo(() => txnType === TxnType.MINT, [txnType]);
  const isBurn = useMemo(() => txnType === TxnType.BURN, [txnType]);

  const DEFAULT_AMOUNT = isMint ? DEFAULT.DEFAULT_MINT_AMOUNT : DEFAULT.DEFAULT_BURN_AMOUNT;
  const SENDING_UNIT = isMint ? TokenId.NEAR : TokenId.goNEAR;
  const RECEIVING_UNIT = isMint ? TokenId.goNEAR : TokenId.NEAR;
  const FEE_TEXT = isMint ?  FeeText.MINT : FeeText.BURN;
  const USER_RECEIVING_PROPORTION = isMint ? ReceivingPropotion.MINT : ReceivingPropotion.BURN;

  //form input
  const [amount, setAmount] = useState("");

  //form input valid
  const [isAmountValid, setIsAmountValid] = useState(true);

  // form check
  const quickCheckAmount = useCallback(
    (amount: string) => REX.AMOUNT_REGEX.test(amount),
    []
  );

  const validateAmount = useCallback(
    (amount: string) => quickCheckAmount(amount),
    [quickCheckAmount]
  );

  const authorizeTxn = useCallback(
    async (/* amount: string */) => {
      if (isAmountValid) {
        if (isMint) {
          await requestSendNearTokenTxn(amount);
        }
        if (isBurn) {
          await requestSignGoNearTxn(amount);
        }
      }
    },
    [amount, isBurn, isMint, isAmountValid]
  );

  return (
    <React.Fragment>
      <FormWrap>
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
                ? (Number(amount) * USER_RECEIVING_PROPORTION - 1)
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
        endIcon={<SendIcon />}
      >
        Send Token
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
  padding: "1rem",
  wrap: "pre-wrap",
}));
