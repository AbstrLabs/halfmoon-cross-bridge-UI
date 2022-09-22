import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from "@mui/material";
import { useCallback, useEffect } from "react";

import { confirmTxn } from "../api-deps/api";
import { TokenId, ApiCallParam, TokenUID, TxnType } from "../api-deps/config";

export function ProcessPage({ accountId }: { accountId: string }) {

  const url = new URL(window.location.href)
  const transactionHash = url.searchParams.get("transactionHashes") || ""
  console.log(transactionHash)

  const transactionType = transactionHash.length === 44 ? TokenId.NEAR : TokenId.ALGO

  const newMintParam: ApiCallParam = {
    from_addr: accountId,
    from_token_id: TokenUID.NEAR,
    from_txn_hash: transactionHash,
    to_token_id: TokenUID.Algorand,
  }

  const newBurnParam: ApiCallParam = {
    from_addr: localStorage.getItem("Algorand") || "",
    from_token_id: TokenUID.Algorand,
    from_txn_hash: transactionHash,
    to_token_id: TokenUID.NEAR,
  }

  let newParam: ApiCallParam = transactionType === TokenId.NEAR ? newMintParam : newBurnParam;

  const send_token = newParam.from_token_id === TokenUID.NEAR ? TokenId.NEAR : TokenId.goNEAR;
  const receive_token = newParam.to_token_id === TokenUID.NEAR ? TokenId.NEAR : TokenId.goNEAR;
  const bridge_type = transactionType === TokenId.NEAR ? TxnType.MINT : TxnType.BURN;

  const apiCall = useCallback(async () => {
    await confirmTxn(newParam)
  }, [newParam])

  useEffect(() => {
    console.log("start sign process")
    apiCall()
  }, [apiCall])

  return (
    <Box textAlign="center" marginBottom="80px" sx={{ fontFamily: "Regular, sans-serif" }}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Regular, sans-serif",
          fontSize: "60px",
          background: "linear-gradient(90.96deg, #7ee6a7 0.59%, #7ad6de 99.19%)",
          backgroundClip: "text",
          textFillColor: "transparent"
        }}
      >Processing Transaction...
      </Typography>

      <TableContainer component={Paper} sx={{
        marginTop: "15px",
        background: "rgba(255, 255, 255, 0.04)",
        border: "5px solid rgba(255, 255, 255, 0.02)",
        borderRadius: "16px",
        backdropFilter: "blur(11px)",
        boxShadow: "0px 10px 15px #88888850"
      }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Bridge Type</TableCell>
              <TableCell align="right">
                {bridge_type}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Signer Address</TableCell>
              <TableCell align="right">
                {newParam.from_addr}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sending Token</TableCell>
              <TableCell align="right">
                {send_token}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Receiving Token</TableCell>
              <TableCell align="right">
                {receive_token}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Hash</TableCell>
              <TableCell align="right">
                {newParam.from_txn_hash}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box >
  );
}