import { Link } from "@mui/material";
import { Links } from "../../api-deps/config"

export function NearTransactionLink({ txnId }: { txnId: string }) {
  return (
    <Link
      href={Links.NearTxn + txnId}
      title="Transaction on Near Explorer"
      target="_blank"
    >
      {txnId}
    </Link>
  );
}
