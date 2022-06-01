// TODO: BAN-70
// TODO steps for Stepper should not index a function (for readability and performance).
// TODO Instead, create a Record<string,callable> to store the relation of step and function.
// TODO The stepper can use the Record<,> directly, instead of using `.action`

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
import React, { useContext, useEffect } from "react";
import { PanelContext, panelType } from "../context/panel";

export function TxnPanel() {
  const panel = useContext(PanelContext) as panelType;

  // render page
  // STEP0: connect to wallet
  useEffect(() => {
    if (panel.connectedAcc.length > 0) {
      panel.updateStepsFinished(0, true);
    } else {
      panel.updateStepsFinished(0, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel.connectedAcc, panel.updateStepsFinished]);
  // STEP1: controlled by page state event
  // STEP2: Authorize transaction
  useEffect(() => {
    // if (panel.isAmountValid && panel.isBeneficiaryValid) {
    // panel.updateStepsFinished(2, true);
    // } else {
    panel.updateStepsFinished(2, false);
    // }
    // TOOD: fix logic, this is same as sum of checking step 0 and 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel.updateStepsFinished]);

  const SENDING_UNIT = panel.isMint ? "NEAR" : "goNEAR";
  const RECEIVING_UNIT = panel.isMint ? "goNEAR" : "NEAR";
  const FEE = panel.isMint ? "0.0%+1" : "0.2%+1";
  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText={`e.g. ${panel.DEFAULT_BENEFICIARY}`}
          label="Beneficiary (Algorand public address)"
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
                ? (
                    Number(panel.amount) * (panel.isMint ? 1 : 0.998) -
                    1
                  ).toFixed(10)
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

      <Stepper
        nonLinear
        activeStep={panel.isStepsFinished?.findIndex((x) => !x)}
        alternativeLabel
      >
        {Object.entries(panel.steps).map(([stepName, stepObject]) => (
          <Step
            key={stepName}
            completed={panel.isStepsFinished?.[stepObject.stepId]}
          >
            <StepButton
              color="inherit"
              onClick={stepObject.action}
              disabled={
                stepObject.stepId !== panel.isStepsFinished.findIndex((x) => !x)
                //TODO: This is same as "Linear", we want non-linear because we want user to be able to disconnect wallet, validate form again etc.
              }
            >
              {/* button title */}
              {panel.isStepsFinished[stepObject.stepId]
                ? stepObject.title.finished
                : stepObject.title.default}
            </StepButton>
          </Step>
        ))}
      </Stepper>

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
