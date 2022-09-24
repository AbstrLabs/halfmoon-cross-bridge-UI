import { Link } from "@mui/material";
import { Links } from "../../api-deps/config"

export function AlgorandTransactionLink({ txnId }: { txnId: string }) {
  return (
    <Link
      href={Links.AlgorandTxn + txnId}
      title="Transaction on Algo Explorer"
      target="_blank"
    >
      {txnId}
    </Link>
  );
}
