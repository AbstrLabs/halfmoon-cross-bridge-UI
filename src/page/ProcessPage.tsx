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
import { BridgeTxnSafeObj } from "../util/shared-types/txn";

export function ProcessPage() {
  let [searchParams] = useSearchParams();
  const params: ApiCallParam = {
    from_token: searchParams.get("from_token") as TokenId,
    to_token: searchParams.get("to_token") as TokenId,
    txn_id:
      // TODO: err handling
      searchParams.get("from_token") === TokenId.NEAR &&
      searchParams.get("to_token") === TokenId.goNEAR
        ? searchParams.get("transactionHashes")!
        : searchParams.get("from_token") === TokenId.goNEAR &&
          searchParams.get("to_token") === TokenId.NEAR
        ? searchParams.get("txnId")!
        : "",
    to_addr: searchParams.get("to_addr")!,
    from_addr: searchParams.get("from_addr")!,
    amount: searchParams.get("amount")!,
  };

  // TODO: LINK-COMP: refactor type TokenLinks, Links, LinkFromAddr, LinkFromTxnHash
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

  function parseResultUrlFromParam(bridgeTxnObject: BridgeTxnSafeObj) {
    const url = new URL("/result", window.location.href);
    url.searchParams.set("dbId", bridgeTxnObject.dbId as string);
    url.searchParams.set("fixedFeeAtom", bridgeTxnObject.fixedFeeAtom);
    url.searchParams.set("marginFeeAtom", bridgeTxnObject.marginFeeAtom);
    url.searchParams.set("createdTime", bridgeTxnObject.createdTime);
    url.searchParams.set("fromAddr", bridgeTxnObject.fromAddr);
    url.searchParams.set("fromAmountAtom", bridgeTxnObject.fromAmountAtom);
    url.searchParams.set("fromTokenId", bridgeTxnObject.fromTokenId);
    url.searchParams.set("fromTxnId", bridgeTxnObject.fromTxnId);
    url.searchParams.set("toAddr", bridgeTxnObject.toAddr);
    url.searchParams.set("toAmountAtom", bridgeTxnObject.toAmountAtom);
    url.searchParams.set("toTokenId", bridgeTxnObject.toTokenId);
    url.searchParams.set("toTxnId", bridgeTxnObject.toTxnId!);
    url.searchParams.set("txnStatus", bridgeTxnObject.txnStatus);
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
    console.log("newParam : ", newParam); // DEV_LOG_TO_REMOVE

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
          const resJson = await res.json();
          const replacingUrl = parseResultUrlFromParam(resJson);
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
