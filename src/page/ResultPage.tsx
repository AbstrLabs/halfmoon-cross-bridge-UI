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
import { TxnType } from "../js/config";
import { useSearchParams } from "react-router-dom";

export function ResultPage() {
  let [searchParams] = useSearchParams();
  const parsedParams = {
    dbId: searchParams.get("dbId")!,
    fixedFeeAtom: searchParams.get("fixedFeeAtom")!,
    marginFeeAtom: searchParams.get("marginFeeAtom")!,
    createdTime: new Date(+searchParams.get("createdTime")!).toLocaleString(),
    fromAddr: searchParams.get("fromAddr")!,
    fromAmountAtom: searchParams.get("fromAmountAtom")!,
    fromTxnId: searchParams.get("fromTxnId")!,
    toAddr: searchParams.get("toAddr")!,
    toAmountAtom: searchParams.get("toAmountAtom")!,
    toTxnId: searchParams.get("toTxnId")!,
    txnType: searchParams.get("txnType")!.toUpperCase() as TxnType,
  };
  // TODO: if any is empty , show another page or redirect to 404.
  let Links: {
    [key in TxnType]: {
      from: ({ addr }: { addr: string }) => JSX.Element;
      to: ({ addr }: { addr: string }) => JSX.Element;
      fromTxnId: ({ txnId }: { txnId: string }) => JSX.Element;
      toTxnId: ({ txnId }: { txnId: string }) => JSX.Element;
    };
  } = {
    MINT: {
      from: NearAddressLink,
      to: AlgorandAddressLink,
      fromTxnId: NearTransactionLink,
      toTxnId: AlgorandTransactionLink,
    },
    BURN: {
      from: AlgorandAddressLink,
      to: NearAddressLink,
      fromTxnId: AlgorandTransactionLink,
      toTxnId: NearTransactionLink,
    },
  };

  return (
    <Box textAlign="center" marginBottom="80px">
      <Box height="4rem" />
      <Typography variant="h2">Transaction Completed</Typography>
      <Box height="2rem" />
      <Typography variant="h4">See Invoice Transaction on Explorer</Typography>
      {Links[parsedParams.txnType].toTxnId({
        txnId: parsedParams.toTxnId,
      })}
      <Box height="4rem" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Transaction type</TableCell>
              <TableCell align="right">{parsedParams.txnType}</TableCell>
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
                {Links[parsedParams.txnType].to({ addr: parsedParams.toAddr })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Signer</TableCell>
              <TableCell align="right">
                {Links[parsedParams.txnType].from({
                  addr: parsedParams.fromAddr,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Signed Transaction ID</TableCell>
              <TableCell align="right">
                {Links[parsedParams.txnType].fromTxnId({
                  txnId: parsedParams.fromTxnId,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Invoice Transaction ID</TableCell>
              <TableCell align="right">
                {Links[parsedParams.txnType].toTxnId({
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
