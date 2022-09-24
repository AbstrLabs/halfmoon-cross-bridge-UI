import { Link } from "@mui/material";
import { Links } from "../../api-deps/config"

export function NearAddressLink({ addr }: { addr: string }) {
  return (
    <Link
      href={Links.NearAddress + addr}
      title="Account on Near Explorer"
      target="_blank"
    >
      {addr}
    </Link>
  );
}
