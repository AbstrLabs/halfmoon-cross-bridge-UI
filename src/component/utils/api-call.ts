import { CONFIG, TxnType } from "../..";

export async function callApi(
  postParam: Record<string, string>,
  txnType: TxnType
) {
  // todo: refactor this type after backend refactor
  const resp = await fetch(
    CONFIG.apiServer.hostname +
      ":" +
      CONFIG.apiServer.port +
      (txnType === TxnType.MINT
        ? CONFIG.apiServer.mintPath
        : CONFIG.apiServer.burnPath),
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
  return resp.json(); // will have a BridgeTxnObj
}
