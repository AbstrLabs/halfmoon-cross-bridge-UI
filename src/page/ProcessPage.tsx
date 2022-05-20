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

export function ProcessPage() {
  let [searchParams] = useSearchParams();
  const type = searchParams.get("type") as TxnType;

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
  // let Links = {
  //   MINT: {
  //     from: NearAddressLink,
  //     to: AlgorandAddressLink,
  //     txnId: NearTransactionLink,
  //   },
  //   BURN: {
  //     from: AlgorandAddressLink,
  //     to: NearAddressLink,
  //     txnId: AlgorandTransactionLink,
  //   },
  // };

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
              <TableCell align="right">{searchParams.get("type")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>NEAR Amount</TableCell>
              <TableCell align="right">{searchParams.get("amount")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beneficiary Address</TableCell>
              <TableCell align="right">
                {Links[type].to({ addr: searchParams.get("to")! })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Signer</TableCell>
              <TableCell align="right">
                {Links[type].from({ addr: searchParams.get("from")! })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell align="right">
                {Links[type].txnId({
                  txnId: searchParams.get("transactionHashes")!,
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
