/* For testnet only */

import { Link } from "@mui/material";

export function AlgorandTransactionLink({ txnId }: { txnId: string }) {
  return (
    <Link
      href={"https://testnet.algoexplorer.io/tx/" + txnId}
      title="Transaction on Algo Explorer"
      target="_blank"
    >
      {txnId}
    </Link>
  );
}
