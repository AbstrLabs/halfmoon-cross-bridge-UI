import EastIcon from '@mui/icons-material/East';
import { Typography, Button, styled } from "@mui/material";
import React, { useCallback, useState } from "react";

import { postTxn, getTxn } from "../api-deps/call-server";
import { TokenId, ApiCallParam, TokenUID, GET_INTERVAL_MS } from "../api-deps/config";

export function SignStep({ transactionHash }: { transactionHash: string }) {

  const transactionType = transactionHash.length === 44 ? TokenId.NEAR : TokenId.ALGO

  const newParam: ApiCallParam = {
    from_addr: 'testalgo.testnet',
    from_token_id: TokenUID.NEAR,
    from_txn_hash: transactionHash,
    to_token_id: TokenUID.Algorand,
  }

  const parseResultUrlFromParam = (id: string) => {
    const url = new URL("/result", window.location.origin);
    url.searchParams.set("transactionHashes", id)
    return url.toString();
  }

  async function watchTxnStatus(uid: string) {
    let finished = false;
    let txnJson;
    while (!finished) {
      const txnRes = await getTxn(uid);
      if (txnRes.status === 200) {
        txnJson = await txnRes.json();
        console.log(txnJson)
        if (txnJson.request_status === "DONE_OUTGOING") {
          finished = true;
        } else if ((txnJson.request_status as string).startsWith("ERROR_")) {
          finished = true;
          alert(
            `Transaction error: ${txnJson.request_status} on Transaction [UID:${uid}]. Please contact support providing this UID.`
          );
        }
      }
      await new Promise((resolve) => setTimeout(resolve, GET_INTERVAL_MS));
    }
    console.log(txnJson)
    // const replacingUrl = parseResultUrlFromParam(txnJson);
    // window.location.replace(replacingUrl);
  }

  const confirmTxn = async () => {
    const res = await postTxn(newParam)
    if (res.status === 400) {
      window.alert("Invalid transaction");
      return;
    }
    if (res.status === 201) {
      const resJson = await res.json();
      console.log(resJson)
      return;
    }
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
      <Button
        color="inherit"
        onClick={() => watchTxnStatus("2")}
        variant="outlined"
        endIcon={<EastIcon />}
      >
        Check Transaction
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