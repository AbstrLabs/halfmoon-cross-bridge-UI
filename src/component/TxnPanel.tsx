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
import React, { useContext } from "react";
import { PanelContext, panelType } from "../context/panel";

export function TxnPanel() {
  const panel = useContext(PanelContext) as panelType;

  const SENDING_UNIT = panel.isMint ? "NEAR" : "goNEAR";
  const RECEIVING_UNIT = panel.isMint ? "goNEAR" : "NEAR";
  const FEE = panel.isMint ? "0.0%+1" : "0.2%+1";
  return (
    <React.Fragment>
      <FormWrap>
        <TextField
          helperText={`e.g. ${panel.DEFAULT_BENEFICIARY}`}
          id="mint_to"
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
          error={
            panel.beneficiary.length > 0 ? !panel.isBeneficiaryValid : false
          }
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
            error={panel.amount.length > 0 ? !panel.isAmountValid : false}
            id="mint_amount"
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
            helperText={`Fee: ${FEE}. Showing all decimals.`}
            inputProps={{
              inputMode: "numeric",
              step: 0.000_000_000_1,
              pattern: "[0-9].*",
            }}
            id="mint_amount"
            label={`Receiving Amount (${RECEIVING_UNIT})`}
            fullWidth
            margin="normal"
            value={(
              Number(panel.amount) * (panel.isMint ? 1 : 0.998) -
              1
            ).toFixed(10)}
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
        {panel.steps
          ? Object.entries(panel.steps).map(([stepName, stepObject]) => (
              <Step
                key={stepName}
                completed={
                  panel.isStepsFinished?.[stepObject.stepId] &&
                  stepObject.status
                }
              >
                <StepButton
                  color="inherit"
                  onClick={stepObject.action}
                  disabled={
                    stepObject.stepId !== 2
                      ? stepObject.stepId >
                        panel.isStepsFinished.findIndex((x) => !x)
                      : !stepObject.status
                  }
                >
                  {/* button title */}
                  {panel.isStepsFinished[stepObject.stepId]
                    ? stepObject.title.finished
                    : stepObject.title.default}
                </StepButton>
              </Step>
            ))
          : null}
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
            {(panel.algoTxnCountdown ? panel.algoTxnCountdown / 10 : 1).toFixed(
              1
            ) + " "}
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
