import { CONFIG } from "../..";

export async function callMintApi(postParam: Record<string, string>) {
  // todo: refactor this type after backend refactor
  const mintResp = await fetch(
    CONFIG.apiServer.hostname +
      ":" +
      CONFIG.apiServer.port +
      CONFIG.apiServer.mintPath,
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(postParam),
      headers: {
        "Content-Type": "application/json",
        "Content-Length": `${Buffer.byteLength(JSON.stringify(postParam))}`,
      },
    }
  );
  // TODO: check if status 200, err handling here
  return mintResp.json(); // will have a BridgeTxnObj
}
