/* For testnet only */

import { Link } from "@mui/material";

export function AlgorandAddressLink({ addr }: { addr: string }) {
  return (
    <Link
      href={"https://testnet.algoexplorer.io/address/" + addr}
      title="Account on Algo Explorer"
      target="_blank"
    >
      {addr}
    </Link>
  );
}
