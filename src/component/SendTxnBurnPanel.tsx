import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  TextField,
  styled,
  Button,
  Modal,
  Typography
} from "@mui/material";
import React, { useCallback, useState } from "react";

import { REX, DEFAULT, TokenId, FeeText, ReceivingPropotion } from "../api-deps/config";
import { requestSignGoNearTxn } from "../api-deps/algorand";

export function SendTxnBurnPanel() {

  const DEFAULT_AMOUNT = DEFAULT.DEFAULT_BURN_AMOUNT;
  const SENDING_UNIT = TokenId.goNEAR;
  const RECEIVING_UNIT = TokenId.NEAR;
  const FEE_TEXT = FeeText.BURN;
  const USER_RECEIVING_PROPORTION = ReceivingPropotion.BURN;

  let ALGOaccount = localStorage.getItem("Algorand") || ""

  //form input
  const [amount, setAmount] = useState("");

  //form input valid
  const [isAmountValid, setIsAmountValid] = useState(true);

  // modal control
  const [isModalOpen, setModalOpen] = useState(false);

  // form check
  const quickCheckAmount = useCallback(
    (amount: string) => REX.AMOUNT_REGEX.test(amount),
    []
  );

  const validateAmount = useCallback(
    (amount: string) => quickCheckAmount(amount),
    [quickCheckAmount]
  );

  const validateForm = useCallback(() => {
    setIsAmountValid(validateAmount(amount));

    if (!isAmountValid) {
      alert("Invalid amount");
    }
    if (isAmountValid && amount !== "") {
      setModalOpen(true)
    }
  }, [
    amount,
    isAmountValid,
    validateAmount,
  ]);

  // send token
  const authorizeTxn = useCallback(
    async (/* amount: string */) => {
      if (isAmountValid) {
        await requestSignGoNearTxn(ALGOaccount, amount);
      }
    },
    [amount, isAmountValid, ALGOaccount]
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
        <Button color="inherit" onClick={validateForm}>
          Validate Form
        </Button>
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
            <Typography variant="h6" component="h2" align="center">
              Confirm transaction
            </Typography>
            <Button
              color="inherit"
              onClick={authorizeTxn}
              variant="outlined"
              endIcon={<SendIcon />}
            >
              Confirm Transaction
            </Button>
            <Button
              color="inherit"
              onClick={() => { setModalOpen(false) }}
              variant="outlined"
              endIcon={<CancelIcon />}
            >
              Cancel Transaction
            </Button>
          </Box>
        </Modal>

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
