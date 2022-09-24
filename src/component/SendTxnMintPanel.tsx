import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  TextField,
  styled,
  Button
} from "@mui/material";
import React, { useCallback, useState } from "react";

import algosdk from "algosdk";
import Big from "big.js";

import { REX, DEFAULT, TokenId, FeeText, ReceivingPropotion, FeePortion } from "../api-deps/config";

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

  // TODO: validate and confirm makes in one
  // send token
  const authorizeTxn = useCallback(
    () => {
      setIsBeneficiaryValid(validateAddress(beneficiary));
      setIsAmountValid(validateAmount(amount));
      if (!isBeneficiaryValid || beneficiary === "") {
        alert("Invalid address");
        return false;
      }
      if (!isAmountValid || amount === "") {
        alert("Invalid amount");
        return false;
      }
      if (isBeneficiaryValid && isAmountValid && beneficiary !== "" && amount !== "") {

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
          helperText={`e.g. ${localStorage.getItem("Algorand") ? localStorage.getItem("Algorand") : DEFAULT_BENEFICIARY}`}
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
                ? (Number(amount) * USER_RECEIVING_PROPORTION - FeePortion.MINT)
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
