/* For testnet only */

import { Link } from "@mui/material";

export function NearTransactionLink({ txnId }: { txnId: string }) {
  return (
    <Link
      href={"https://explorer.testnet.near.org/transactions/" + txnId}
      title="Transaction on Near Explorer"
      target="_blank"
    >
      {txnId}
    </Link>
  );
}
