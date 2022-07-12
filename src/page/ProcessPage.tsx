import { StringifiedBridgeTxnObject, TxnType } from "../api-deps/config";
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
import { postTxn } from "../api-deps/api-call";
import { useSearchParams } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";
import { ApiCallParam } from "../util/shared-types/api";
import { TokenId } from "../util/shared-types/token";

type LinkFromAddr = ({ addr }: { addr: string }) => JSX.Element;
type LinkFromTxnHash = ({ txnId }: { txnId: string }) => JSX.Element;

export function ProcessPage() {
  let [searchParams] = useSearchParams();
  const params: ApiCallParam = {
    from_token: searchParams.get("from_token") as TokenId,
    to_token: searchParams.get("to_token") as TokenId,
    txn_id: (searchParams.get("type") === TxnType.MINT
      ? searchParams.get("transactionHashes")
      : searchParams.get("txnId"))!,
    to_addr: searchParams.get("to")!,
    from_addr: searchParams.get("from")!,
    amount: searchParams.get("amount")!,
  };

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
    const newParam: ApiCallParam = {
      from_addr: params.from_addr,
      from_token: params.from_token,
      to_addr: params.to_addr,
      to_token: params.to_token,
      amount: params.amount,
      txn_id: params.txn_id,
    };
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
              <TableCell>Transaction Tokens</TableCell>
              <TableCell align="right">
                {params.from_token} ➡️ {params.to_token}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>From Address</TableCell>
              {Links[params.from_token].acc({ addr: params.from_addr })}
            </TableRow>
            <TableRow>
              <TableCell>Beneficiary Address</TableCell>
              {Links[params.to_token].acc({ addr: params.to_addr })}
            </TableRow>
            <TableRow>
              <TableCell>NEAR Amount</TableCell>
              <TableCell align="right">{params.amount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell align="right">
                {Links[params.to_token].txn({
                  txnId: params.txn_id,
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
