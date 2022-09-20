import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  TextField,
  styled,
  Button,
  Modal,
  Typography,
  Grid
} from "@mui/material";
import React, { useCallback, useState } from "react";

import algosdk from "algosdk";
import Big from "big.js";

import { REX, DEFAULT, TokenId, FeeText, ReceivingPropotion } from "../api-deps/config";

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

export function SendTxnMintPanel({ contract }: { contract: any }) {


  const DEFAULT_BENEFICIARY = DEFAULT.DEFAULT_MINT_BENEFICIARY

  const DEFAULT_AMOUNT = DEFAULT.DEFAULT_MINT_AMOUNT;
  const SENDING_UNIT = TokenId.NEAR;
  const RECEIVING_UNIT = TokenId.goNEAR;
  const FEE_TEXT = FeeText.MINT;
  const USER_RECEIVING_PROPORTION = ReceivingPropotion.MINT;

  //form input
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");

  //form input valid
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(true);
  const [isAmountValid, setIsAmountValid] = useState(true);

  // modal control
  const [isModalOpen, setModalOpen] = useState(false);

  // form check
  const quickCheckAddress = useCallback(
    (addr: string) => REX.ALGORAND_ADDR_REGEX.test(addr),
    []
  );
  const validateAddress = useCallback(
    (addr: string) =>
      quickCheckAddress(addr) && algosdk.isValidAddress(addr),
    [quickCheckAddress]
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
    if (!isBeneficiaryValid || beneficiary === "") {
      alert("Invalid address");
      return;
    }
    if (!isAmountValid || amount === "") {
      alert("Invalid amount");
      return;
    }
    if (isBeneficiaryValid && isAmountValid && beneficiary !== "" && amount !== "") {
      setModalOpen(true)
    }
  }, [
    amount,
    beneficiary,
    isAmountValid,
    isBeneficiaryValid,
    validateAddress,
    validateAmount,
  ]);

  // send token
  const authorizeTxn = useCallback(
    async (/* amount: string */) => {
      if (isAmountValid && isBeneficiaryValid) {

        contract.add_bridge_request(
          {
            to_blockchain: "Algorand",
            to_addr: beneficiary,
          },
          BOATLOAD_OF_GAS,
          Big(amount).times(10 ** 24).toFixed()
        ).then(() => {
          console.log('done')
        })

      }
    },
    [amount, beneficiary, isAmountValid, isBeneficiaryValid, contract]
  );

  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText={`e.g. ${DEFAULT_BENEFICIARY}`}
          label={
            "Beneficiary (Algorand public address)"
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
        <Button color="inherit" onClick={validateForm} variant="outlined">
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
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              color: "text.primary",
              bgcolor: "background.paper",
              border: "2px solid #0D1019",
              borderRadius: "15px",
              boxShadow: "0px 0px 18px 12px #7f7f7f50",
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" align="center">
              Confirm Transaction
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Button
                color="inherit"
                onClick={authorizeTxn}
                variant="outlined"
                endIcon={<SendIcon />}
              >
                Confirm
              </Button>
              <Button
                color="inherit"
                onClick={() => { setModalOpen(false) }}
                variant="outlined"
                endIcon={<CancelIcon />}
                sx={{ alignSelf: "right" }}
              >
                Cancel
              </Button>
            </Grid>
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
  padding: "0",
  wrap: "pre-wrap",
}));
