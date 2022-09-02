import { CONFIG, ApiCallParam } from "./config";

/**
 * call server with POST method
 *
 * @param postParam
 * @returns
 */
export async function postTxn(postParam: ApiCallParam) {
  // todo: refactor this type after backend refactor

  const resp = await fetch(CONFIG.apiServerUrl, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(postParam),
    headers: {
      "Content-Type": "application/json",
      "Content-Length": `${Buffer.byteLength(JSON.stringify(postParam))}`,
    },
  });
  // TODO: check if status 200, err handling here
  return resp; // will have a {uid, BridgeTxnStatus} json in body
}

/**
 * call server with POST method
 *
 * @param uid - uid of the txn with format {DbId}.{TxnId}
 * @returns
 */
export async function getTxn(uid: string) {
  const resp = await fetch(`${CONFIG.apiServerUrl}/?uid=${uid}`);
  return resp; // will have a BridgeTxnObj in body
}
