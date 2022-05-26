import { CONFIG } from "./config";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk from "algosdk";

export {
  myAlgoWallet,
  optInGoNear,
  checkOptedIn,
  authorizeBurnTransaction,
};

const myAlgoWallet = new MyAlgoConnect();

const ALGO_UNIT = 10_000_000_000;
const GO_NEAR_ASA_ID = 83251085;

// const algodClient = new algosdk.Algodv2('', 'https://node.testnet.algoexplorerapi.io', '');
const algodClient = new algosdk.Algodv2(
  { "X-API-Key": "WLJDqY55G5560kyCJVp647ERNZ5kJkdZ8OUdGNnV" },
  "https://testnet-algorand.api.purestake.io/ps2",
  ""
);

/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */

/* Algorand wallet transfer function */
async function signGoNearTransaction(
  from: string,
  to: string,
  amountAlgo: number
) {
  await myAlgoWallet.connect();
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams,
      from,
      to,
      amount: amountAlgo,
      assetIndex: GO_NEAR_ASA_ID,
    });
    const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
    const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
    return response;
  } catch (err) {
    console.error(err);
  }
}

const requestSignGoNearTxn = async (fromAdd:string,amountStr: string) => {
  const from = fromAdd;
  const to = CONFIG.acc.algorand_master;
  const amount = +amountStr * ALGO_UNIT;
  try {
    const response = await signGoNearTransaction(from, to, amount);
    // TODO: Err handling: no goNEAR in acc.
    return response.txId;
  } catch (err) {
    console.error(err);
  }
};

const optInGoNear = async (addr: string) => {
  const response = await signGoNearTransaction(addr, addr, 0);
  return response.txId;
};

async function checkOptedIn(addr: string, option = { showAlert: false }) {
  if (addr === undefined) {
    window.alert("checking opted-in for empty addr");
  }
  let accountInfo = await algodClient.accountInformation(addr).do();
  for (let assetInfo of accountInfo["assets"]) {
    if (assetInfo["asset-id"] === GO_NEAR_ASA_ID) {
      if (option.showAlert) {
        window.alert("opted in");
      }
      return true;
    }
  }
  if (option.showAlert) {
    window.alert("not opted in");
  }
  return false;
}

const authorizeBurnTransaction = async (
  burnSender: string,
  burnReceiver: string,
  amount: string
) => {
  const cbUrl = new URL("/process", window.location.href);
  cbUrl.searchParams.set("type", "BURN");
  cbUrl.searchParams.set("amount", amount);
  cbUrl.searchParams.set("to", burnReceiver);
  cbUrl.searchParams.set("from", burnSender);

  let txnId = await requestSignGoNearTxn(burnSender, amount);
  cbUrl.searchParams.set("txnId", txnId);

  const callbackUrl = cbUrl.toString();
  console.log("callbackUrl : ", callbackUrl); // DEV_LOG_TO_REMOVE

  setTimeout(() => {
    window.location.assign(callbackUrl);
  }, 10000);
};
