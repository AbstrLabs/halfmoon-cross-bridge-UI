import { ApiCallParam } from "../util/shared-types/api";
import { CONFIG } from "./config";

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
  return resp; // will have a BridgeTxnObj
}
