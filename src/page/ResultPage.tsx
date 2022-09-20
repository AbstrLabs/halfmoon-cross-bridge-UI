import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";

import { AlgorandAddressLink } from "../component/links/AlgorandAddressLink";
import { AlgorandTransactionLink } from "../component/links/AlgorandTransactionLink";
import { NearAddressLink } from "../component/links/NearAddressLink";
import { NearTransactionLink } from "../component/links/NearTransactionLink";

import { getTxn } from "../api-deps/call-server";
import { BridgeTxnSafeObj, TokenId, GET_INTERVAL_MS } from "../api-deps/config";

export function ResultPage() {
  type LinkFromAddr = ({ addr }: { addr: string }) => JSX.Element;
  type LinkFromTxnHash = ({ txnId }: { txnId: string }) => JSX.Element;
  type TokenLinks = {
    acc: LinkFromAddr;
    txn: LinkFromTxnHash;
  };
  let Links: Record<TokenId, TokenLinks> = {
    [TokenId.NEAR]: {
      acc: NearAddressLink,
      txn: NearTransactionLink,
    },
    [TokenId.goNEAR]: {
      acc: AlgorandAddressLink,
      txn: AlgorandTransactionLink,
    },
    [TokenId.wALGO]: {
      acc: NearAddressLink,
      txn: NearTransactionLink,
    },
    [TokenId.ALGO]: {
      acc: AlgorandAddressLink,
      txn: AlgorandTransactionLink,
    },
  };

  const emptyTxn: BridgeTxnSafeObj = {
    created_time: "",
    from_addr: "",
    from_amount_atom: "",
    from_token_id: TokenId.NEAR,
    from_txn_hash: "",
    to_addr: "",
    to_amount_atom: "",
    to_token_id: TokenId.goNEAR,
    to_txn_hash: ""
  }
  const [txn, setTxn] = useState(emptyTxn)

  async function watchTxnStatus(uid: string) {
    let finished = false;
    let txnJson;
    while (!finished) {
      const txnRes = await getTxn(uid);
      if (txnRes.status === 200) {
        txnJson = await txnRes.json();
        if (txnJson.request_status === "DONE_OUTGOING") {
          finished = true;
          let txnInfo = {
            created_time: txnJson.created_time,
            from_addr: txnJson.from_addr,
            from_amount_atom: txnJson.from_amount_atom,
            from_token_id: txnJson.from_token_id === 2 ? TokenId.NEAR : TokenId.goNEAR,
            from_txn_hash: txnJson.from_txn_hash,
            to_addr: txnJson.to_addr,
            to_amount_atom: txnJson.to_amount_atom,
            to_token_id: txnJson.to_token_id === 2 ? TokenId.NEAR : TokenId.goNEAR,
            to_txn_hash: txnJson.to_txn_hash
          }
          setTxn(txnInfo)
          break;
        } else if ((txnJson.request_status as string).startsWith("ERROR_")) {
          finished = true;
          window.alert(
            `Request error: ${txnJson.request_status} on Request [UID:${uid}]. Please contact support providing this UID.`
          );
          console.log("error message ", txnJson.err_msg)
          console.log("invalid reason ", txnJson.invalid_reason)
          break
        }
      }
      await new Promise((resolve) => setTimeout(resolve, GET_INTERVAL_MS));
    }
    return false
  }

  const watch = useCallback(async () => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (id !== null) {
      await watchTxnStatus(id)
    }
  }, [watchTxnStatus])

  useEffect(() => {
    watch();
    // The effect calls innerFunction, hence it should declare it as a dependency
    // Otherwise, if something about innerFunction changes (e.g. the data it uses), the effect would run the outdated version of innerFunction
  }, [watch]);

  return (
    <Box textAlign="center" marginBottom="80px" sx={{ fontFamily: "Regular, sans-serif" }}>
      <Box height="4rem" />
      <Typography variant="h2">Transaction Completed</Typography>
      <Box height="2rem" />
      <Typography variant="h4">See Invoice Transaction on Explorer</Typography>
      {/* TODO: TO-HASH : make this a component */}
      {txn.to_txn_hash === null || txn.to_txn_hash === undefined
        ? "loading..."
        : Links[txn.to_token_id].txn({
          txnId: txn.to_txn_hash,
        })}
      <Box height="4rem" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Transaction type</TableCell>
              <TableCell align="right">
                {txn.from_token_id} ➡️ {txn.to_token_id}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount Sent (unit: 1e-10)</TableCell>
              <TableCell align="right">{txn.from_amount_atom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount Received (unit: 1e-10)</TableCell>
              <TableCell align="right">{txn.to_amount_atom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beneficiary Address</TableCell>
              <TableCell align="right">
                {Links[txn.to_token_id].acc({
                  addr: txn.to_addr,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Signer</TableCell>
              <TableCell align="right">
                {Links[txn.from_token_id].acc({
                  addr: txn.from_addr,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Signed Transaction ID</TableCell>
              <TableCell align="right">
                {Links[txn.from_token_id].txn({
                  txnId: txn.from_txn_hash,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Invoice Transaction ID</TableCell>
              <TableCell align="right">
                {/* TODO: TO-HASH : make this a component */}
                {txn.to_txn_hash === null ||
                  txn.to_txn_hash === undefined
                  ? "loading..."
                  : Links[txn.to_token_id].txn({
                    txnId: txn.to_txn_hash,
                  })}
              </TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell>Sweeping Miner Fee (unit: 1e-10)</TableCell>
              <TableCell align="right">{txn.fixedFeeAtom}</TableCell>
            </TableRow> */}
            {/* <TableRow>
              <TableCell>Transaction Fee (unit: 1e-10)</TableCell>
              <TableCell align="right">{txn.marginFeeAtom}</TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell>Created in Database</TableCell>
              <TableCell align="right">{txn.created_time}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
