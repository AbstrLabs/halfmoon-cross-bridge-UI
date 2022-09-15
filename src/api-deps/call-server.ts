import { CONFIG, ApiCallParam } from "./config";

/**
 * call server with POST method
 *
 * @param postParam
 * @returns
 */
export async function postTxn(postParam: ApiCallParam) {

  const resp = await fetch(CONFIG.apiServerUrl + "/bridge", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(postParam),
    headers: {
      "Content-Type": "application/json",
      "Content-Length": `${Buffer.byteLength(JSON.stringify(postParam))}`,
    },
  });

  return resp;
}

/**
 * call server with GET method
 *
 * @param uid - uid of the txn with format {DbId}.{TxnId}
 * @returns
 */
export async function getTxn(uid: string) {
  const resp = await fetch(`${CONFIG.apiServerUrl}/bridge/?id=${uid}`);
  return resp; // will have a BridgeTxnObj in body
}
