import { ApiParam, StringifiedBridgeTxnObject, TxnType } from "../js/config";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

import { AlgorandAddressLink } from "../component/links/AlgorandAddressLink";
import { AlgorandTransactionLink } from "../component/links/AlgorandTransactionLink";
import { Box } from "@mui/system";
import { NearAddressLink } from "../component/links/NearAddressLink";
import { NearTransactionLink } from "../component/links/NearTransactionLink";
import { callApi } from "../js/api-call";
import { useSearchParams } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";

export function ProcessPage() {
  let [searchParams] = useSearchParams();
  const params: ApiParam = {
    type: searchParams.get("type") as TxnType,
    txnId: (searchParams.get("type") === TxnType.MINT
      ? searchParams.get("transactionHashes")
      : searchParams.get("txnId"))!,
    to: searchParams.get("to")!,
    from: searchParams.get("from")!,
    amount: searchParams.get("amount")!,
  };
  let Links: {
    [key in TxnType]: {
      from: ({ addr }: { addr: string }) => JSX.Element;
      to: ({ addr }: { addr: string }) => JSX.Element;
      txnId: ({ txnId }: { txnId: string }) => JSX.Element;
    };
  } = {
    MINT: {
      from: NearAddressLink,
      to: AlgorandAddressLink,
      txnId: NearTransactionLink,
    },
    BURN: {
      from: AlgorandAddressLink,
      to: NearAddressLink,
      txnId: AlgorandTransactionLink,
    },
  };

  function getResultUrlFromParam(bridgeTxnObject: StringifiedBridgeTxnObject) {
    const url = new URL("/result", window.location.href);
    url.searchParams.set("dbId", bridgeTxnObject.dbId);
    url.searchParams.set("fixedFeeAtom", bridgeTxnObject.fixedFeeAtom);
    url.searchParams.set("marginFeeAtom", bridgeTxnObject.marginFeeAtom);
    url.searchParams.set("createdTime", bridgeTxnObject.createdTime);
    url.searchParams.set("fromAddr", bridgeTxnObject.fromAddr);
    url.searchParams.set("fromAmountAtom", bridgeTxnObject.fromAmountAtom);
    url.searchParams.set("fromTxnId", bridgeTxnObject.fromTxnId);
    url.searchParams.set("toAddr", bridgeTxnObject.toAddr);
    url.searchParams.set("toAmountAtom", bridgeTxnObject.toAmountAtom);
    url.searchParams.set("toTxnId", bridgeTxnObject.toTxnId);
    url.searchParams.set("txnType", bridgeTxnObject.txnType);
    return url.toString();
  }

  useEffectOnce(() => {
    const newParam: ApiParam = {
      type: params.type,
      from: params.from,
      to: params.to,
      txnId: params.txnId,
      amount: params.amount,
    };
    callApi(newParam)
      .then(async (res: any) => {
        console.log("res : ", res); // DEV_LOG_TO_REMOVE
        if (res.status === 400) {
          window.alert("Invalid transaction");
          return;
        }
        if (res.status === 404) {
          window.alert("Transaction not found");
          return;
        }
        if (res.status === 406) {
          window.alert("Double mint detected");
          return;
        }
        if (res.status === 200) {
          const resJson = await res.json();
          const replacingUrl = getResultUrlFromParam(resJson);
          window.location.replace(replacingUrl);
          return;
        }
        throw new Error(`${res.status} ${res.statusText}`);
      })
      .catch((err: any) => {
        console.error("API server rejected. Error : ", err.message); // DEV_LOG_TO_REMOVE
        alert("API server rejected!");
      });
  });

  return (
    <Box textAlign="center">
      <Box height="4rem" />
      <Typography variant="h2">Processing Transaction...</Typography>
      <Box height="2rem" />
      <Typography variant="h4">Please wait for redirection.</Typography>
      <Box height="4rem" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Transaction type</TableCell>
              <TableCell align="right">{params.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>NEAR Amount</TableCell>
              <TableCell align="right">{params.amount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beneficiary Address</TableCell>
              <TableCell align="right">
                {Links[params.type].to({ addr: params.to })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Signer</TableCell>
              <TableCell align="right">
                {Links[params.type].from({ addr: params.from })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell align="right">
                {Links[params.type].txnId({
                  txnId: params.txnId,
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
