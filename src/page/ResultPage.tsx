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
import { TxnType } from "..";
import { useSearchParams } from "react-router-dom";

export function ResultPage() {
  let [searchParams] = useSearchParams();
  const params = {
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
      {Links[params.txnType].toTxnId({
        txnId: params.toTxnId,
      })}
      <Box height="4rem" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Transaction type</TableCell>
              <TableCell align="right">{params.txnType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount Sent(in 1e-10)</TableCell>
              <TableCell align="right">{params.fromAmountAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount Received(in 1e-10)</TableCell>
              <TableCell align="right">{params.toAmountAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beneficiary Address</TableCell>
              <TableCell align="right">
                {Links[params.txnType].to({ addr: params.toAddr })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Signer</TableCell>
              <TableCell align="right">
                {Links[params.txnType].from({ addr: params.fromAddr })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Signed Transaction ID</TableCell>
              <TableCell align="right">
                {Links[params.txnType].fromTxnId({
                  txnId: params.fromTxnId,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Invoice Transaction ID</TableCell>
              <TableCell align="right">
                {Links[params.txnType].toTxnId({
                  txnId: params.toTxnId,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>fixedFeeAtom</TableCell>
              <TableCell align="right">{params.fixedFeeAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>marginFeeAtom</TableCell>
              <TableCell align="right">{params.marginFeeAtom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>createdTime</TableCell>
              <TableCell align="right">{params.createdTime}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
