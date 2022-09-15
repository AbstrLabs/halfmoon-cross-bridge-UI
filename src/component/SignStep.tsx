import EastIcon from '@mui/icons-material/East';
import { Typography, Button, styled } from "@mui/material";
import React, { useCallback, useState } from "react";

import { postTxn } from "../api-deps/call-server";
import { TokenId, ApiCallParam, FROM_AMOUNT_ATOM, TokenUID } from "../api-deps/config";

export function SignStep({ transactionHash }: { transactionHash: string }) {

  const transactionType = transactionHash.length === 44 ? TokenId.NEAR : TokenId.ALGO

  const newParam: ApiCallParam = {
    from_addr: 'testalgo.testnet',
    from_amount_atom: transactionType === TokenId.NEAR ? FROM_AMOUNT_ATOM.NEAR : FROM_AMOUNT_ATOM.goNEAR,
    from_token_id: TokenUID.NEAR,
    from_txn_hash: transactionHash,
    to_addr: 'ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA',
    to_token_id: TokenUID.Algorand,
    comment: ''
  }

  const parseResultUrlFromParam = (id: string) => {
    const url = new URL("/result", window.location.origin);
    return url.toString();
  }

  const confirmTxn = () => {
    postTxn(newParam)
      .then(async (res: any) => {
        if (res.status === 400) {
          window.alert("Invalid transaction");
          return;
        }
        if (res.status === 404) {
          window.alert("Transaction not found");
          return;
        }
        if (res.status === 406) {
          window.alert("406, should be Double mint detected");
          return;
        }
        if (res.status === 200) {
          const resJson = res.json();
          console.log(resJson)

          // window.location.replace(parseResultUrlFromParam)
          return;
        }
        throw new Error(`${res.status} ${res.statusText}`);
      })
      .catch((err: any) => {
        console.error("API server rejected. Error : ", err.message);
        alert("API server rejected!");
      })
  }

  return (
    <Wrap>
      <Typography align="center">
        {transactionHash}
      </Typography>
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
  padding: "1px"
}));