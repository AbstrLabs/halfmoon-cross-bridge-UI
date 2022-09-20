import EastIcon from '@mui/icons-material/East';
import { Typography, Button, styled } from "@mui/material";
import React, { useCallback, useState } from "react";

import { postTxn } from "../api-deps/call-server";
import { TokenId, ApiCallParam, TokenUID } from "../api-deps/config";

export function SignStep({ transactionHash, currentUser }: { transactionHash: string, currentUser: string }) {

  const transactionType = transactionHash.length === 44 ? TokenId.NEAR : TokenId.ALGO

  const newMintParam: ApiCallParam = {
    from_addr: currentUser,
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

  let newParam: ApiCallParam = transactionType === TokenId.NEAR ? newMintParam : newBurnParam

  const parseResultUrlFromParam = (id: string) => {
    const url = new URL("/result", window.location.origin);
    url.searchParams.set("id", id);
    return url.toString();
  }

  const confirmTxn = async () => {
    console.log(newParam)
    const res = await postTxn(newParam)
    if (res.status === 400) {
      window.alert("Invalid transaction");
      return;
    }
    if (res.status === 201) {
      const resJson = await res.json();
      const replacingUrl = parseResultUrlFromParam(resJson.id);
      window.location.replace(replacingUrl);
      return;
    }
  }

  return (
    <Wrap>
      <Typography align="left">
        Sender address: {transactionType === TokenId.NEAR ? currentUser : localStorage.getItem("Algorand")}
      </Typography>
      <Typography>Send token: {transactionType === TokenId.NEAR ? TokenId.NEAR : TokenId.goNEAR}</Typography>
      <Typography>Receive token: {transactionType === TokenId.NEAR ? TokenId.goNEAR : TokenId.NEAR}</Typography>
      <Typography>Transaction hash: {transactionHash}</Typography>
      <Button
        color="inherit"
        onClick={confirmTxn}
        variant="outlined"
        endIcon={<EastIcon />}
      >
        Confirm Transaction
      </Button>
    </Wrap>
  );
}

/* ======== STYLED ======== */

const Wrap = styled("div")(() => ({
  position: "relative",
  margin: "2px",
  width: "100%",
  wrap: "pre-wrap",
  padding: "1px",
  fontFamily: "Regular, sans-serif"
}));