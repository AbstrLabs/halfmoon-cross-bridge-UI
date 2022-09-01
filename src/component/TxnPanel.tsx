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
import React, { useContext } from "react";
import { PanelContext, PanelCtxInterface } from "../context/panel";

export function TxnPanel() {
  const panel = useContext(PanelContext) as PanelCtxInterface;

  // render page
  // STEP0: connect to wallet

  // STEP1: controlled by page state event
  // STEP2: Authorize transaction

  const SENDING_UNIT = panel.isMint ? "NEAR" : "goNEAR";
  const RECEIVING_UNIT = panel.isMint ? "goNEAR" : "NEAR";
  const FEE = panel.isMint ? "0.0%+1" : "0.2%+1";
  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText={`e.g. ${panel.DEFAULT_BENEFICIARY}`}
          label={
            panel.isMint
              ? "Beneficiary (Algorand public address)"
              : "Beneficiary (NEAR public address)"
          }
          fullWidth
          margin="normal"
          value={panel.beneficiary}
          onChange={(e) => {
            const v = e.target.value;
            panel.setBeneficiary?.(v);
            if (panel.quickCheckAddress?.(v)) {
              panel.setIsBeneficiaryValid?.(
                panel.validateAddress?.(v) || v === ""
              );
            }
          }}
          error={!panel.isBeneficiaryValid}
          onBlur={(e) => {
            const v = e.target.value;
            if (v === "") return;
            panel.setIsBeneficiaryValid?.(
              panel.validateAddress?.(v) || v === ""
            );
          }}
        />
        <Box display="flex">
          <TextField
            helperText={`e.g. ${panel.DEFAULT_AMOUNT}, up to 10 decimals`}
            inputProps={{
              inputMode: "numeric",
              step: 0.000_000_000_1,
              pattern: "[0-9].*",
            }}
            error={!panel.isAmountValid}
            label={`Sending Amount (${SENDING_UNIT})`}
            fullWidth
            margin="normal"
            value={panel.amount}
            onChange={(e) => {
              const v = e.target.value;
              panel.setAmount?.(v);
              panel.setIsAmountValid?.(panel.validateAmount?.(v) || v === "");
            }}
          />
          <Box width="2rem" />
          <TextField
            label={`Receiving Amount (${RECEIVING_UNIT})`}
            helperText={`Fee: ${FEE}. Showing all decimals.`}
            fullWidth
            margin="normal"
            value={
              panel.amount
                ? (Number(panel.amount) * (panel.isMint ? 1 : 0.998) - 1)
                    .toFixed(11)
                    .slice(0, -1)
                : ""
            }
            error={
              panel.amount
                ? Number(panel.amount) * (panel.isMint ? 1 : 0.998) <= 1
                : false
            }
            disabled
          />
        </Box>
      </FormWrap>
      <Box height="60px"></Box>
      (panel.isMint?
      <Button color="inherit" onClick={panel.connectWallet}>
        Connect Wallet
      </Button>
      :
      <Button color="inherit" onClick={panel.connectWallet}>
        Connect Wallet
      </Button>
      )
      <Button color="inherit" onClick={panel.validateForm}>
        Validate Form
      </Button>
      <Button color="inherit" onClick={panel.authorizeTxn}>
        Authorize Transaction
      </Button>
      <Modal
        open={panel.isModalOpen ? panel.isModalOpen : false}
        onClose={() => {
          panel.setModalOpen(true);
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
            {(panel.algoTxnCountdown / 10).toFixed(1) + " "}
            more second(s).
          </Typography>
          <Box height="1rem"></Box>
          <LinearProgress
            variant="determinate"
            value={panel.algoTxnCountdown}
          />
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
