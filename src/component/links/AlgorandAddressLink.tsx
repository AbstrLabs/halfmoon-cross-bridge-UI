import { Link } from "@mui/material";
import { Links } from "../../api-deps/config"

export function AlgorandAddressLink({ addr }: { addr: string }) {
  return (
    <Link
      href={Links.AlgorandAddress + addr}
      title="Account on Algo Explorer"
      target="_blank"
    >
      {addr}
    </Link>
  );
}
