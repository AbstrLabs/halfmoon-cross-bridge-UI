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
import { callApi } from "../component/utils/api-call";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function ProcessPage() {
  let [searchParams] = useSearchParams();
  const params = {
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

  useEffect(() => {
    if (params.type === TxnType.MINT) {
      const mintParam = {
        mint_from: params.from,
        mint_to: params.to,
        mint_txnId: params.txnId,
        mint_amount: params.amount,
      };
      console.log("minting with mintParam : ", mintParam); // DEV_LOG_TO_REMOVE
      callApi(mintParam, params.type).then((res: any) => {
        console.log("res : ", res); // DEV_LOG_TO_REMOVE
      });
    }
    if (params.type === TxnType.BURN) {
      const burnParam = {
        burn_from: params.from,
        burn_to: params.to,
        burn_txnId: params.txnId,
        burn_amount: params.amount,
      };
      console.log("burning with burnParam : ", burnParam); // DEV_LOG_TO_REMOVE
      callApi(burnParam, params.type).then((res: any) => {
        console.log("res : ", res); // DEV_LOG_TO_REMOVE
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
