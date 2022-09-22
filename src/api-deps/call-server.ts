import { CONFIG, ApiCallParam, TokenUID } from "./config";

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
 * call server with GET txn method
 *
 * @param uid - uid of the txn with format {DbId}.{TxnId}
 * @returns
 */
export async function getTxn(uid: string) {
  const resp = await fetch(`${CONFIG.apiServerUrl}/bridge/?id=${uid}`);
  return resp; // will have a BridgeTxnObj in body
}

/**
 * call server with GET fee method
 *
 * @param from_token_id 
 * @param to_token_id
 * @returns
 */
export async function getFee(from_token_id: TokenUID, to_token_id: TokenUID) {
  const resp = await fetch(`${CONFIG.apiServerUrl}/fees?from_token_id=${from_token_id}&to_token_id=${to_token_id}`);
  return resp;
}
