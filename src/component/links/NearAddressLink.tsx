/* For testnet only */

import { Link } from "@mui/material";

export function NearAddressLink({ addr }: { addr: string }) {
  return (
    <Link
      href={"https://explorer.testnet.near.org/accounts/" + addr}
      title="Account on Near Explorer"
      target="_blank"
    >
      {addr}
    </Link>
  );
}
