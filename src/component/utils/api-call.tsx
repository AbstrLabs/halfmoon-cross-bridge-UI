import { Constants } from "../..";

export async function callMintApi(postParam: Record<string, string>) {
  // todo: refactor this type after ref backend
  const mintResp = await fetch(
    Constants.apiServer.hostname +
      ":" +
      Constants.apiServer.port +
      Constants.apiServer.mintPath,
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
  return mintResp.json();
}
