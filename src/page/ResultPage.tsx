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
import { useSearchParams } from "react-router-dom";
import {
  BridgeTxnSafeObj,
  BridgeTxnStatusEnum,
} from "../api-deps/types/txn";
import { TokenId } from "../api-deps/types/token";

export function ResultPage() {
  let [searchParams] = useSearchParams();
  const parsedParams: BridgeTxnSafeObj = {
    dbId: searchParams.get("dbId")!,
    fixedFeeAtom: searchParams.get("fixedFeeAtom")!,
    marginFeeAtom: searchParams.get("marginFeeAtom")!,
    createdTime: new Date(+searchParams.get("createdTime")!).toLocaleString(), // this passes type check but is not by design
    fromAddr: searchParams.get("fromAddr")!,
    fromAmountAtom: searchParams.get("fromAmountAtom")!,
    fromTokenId: searchParams.get("fromTokenId") as TokenId,
    fromTxnId: searchParams.get("fromTxnId")!,
    toAddr: searchParams.get("toAddr")!,
    toAmountAtom: searchParams.get("toAmountAtom")!,
    toTokenId: searchParams.get("toTokenId") as TokenId,
    toTxnId: searchParams.get("toTxnId")!,
    txnStatus: searchParams.get("txnStatus")! as BridgeTxnStatusEnum,
  };
  // TODO: if any is empty , show another page or redirect to 404.
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

  return (
    <Box textAlign="center" marginBottom="80px">
      <Box height="4rem" />
      <Typography variant="h2">Transaction Completed</Typography>
      <Box height="2rem" />
      <Typography variant="h4">See Invoice Transaction on Explorer</Typography>
      {/* TODO: TO-HASH : make this a component */}
      {parsedParams.toTxnId === null || parsedParams.toTxnId === undefined
        ? "loading..."
        : Links[parsedParams.toTokenId].txn({
            txnId: parsedParams.toTxnId,
          })}
      <Box height="4rem" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Transaction type</TableCell>
              <TableCell align="right">
                {parsedParams.fromTokenId} ➡️ {parsedParams.toTokenId}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount Sent (unit: 1e-10)</TableCell>
              <TableCell align="right">{parsedParams.fromAmountAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount Received (unit: 1e-10)</TableCell>
              <TableCell align="right">{parsedParams.toAmountAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beneficiary Address</TableCell>
              <TableCell align="right">
                {Links[parsedParams.toTokenId].acc({
                  addr: parsedParams.toAddr,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Signer</TableCell>
              <TableCell align="right">
                {Links[parsedParams.fromTokenId].acc({
                  addr: parsedParams.fromAddr,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Signed Transaction ID</TableCell>
              <TableCell align="right">
                {Links[parsedParams.fromTokenId].txn({
                  txnId: parsedParams.fromTxnId,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Invoice Transaction ID</TableCell>
              <TableCell align="right">
                {/* TODO: TO-HASH : make this a component */}
                {parsedParams.toTxnId === null ||
                parsedParams.toTxnId === undefined
                  ? "loading..."
                  : Links[parsedParams.toTokenId].txn({
                      txnId: parsedParams.toTxnId,
                    })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sweeping Miner Fee (unit: 1e-10)</TableCell>
              <TableCell align="right">{parsedParams.fixedFeeAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Fee (unit: 1e-10)</TableCell>
              <TableCell align="right">{parsedParams.marginFeeAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created in Database</TableCell>
              <TableCell align="right">{parsedParams.createdTime}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
