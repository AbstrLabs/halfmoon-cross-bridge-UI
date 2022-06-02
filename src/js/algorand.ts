import { CONFIG } from "./config";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk from "algosdk";

export {
  myAlgoWallet,
  optInGoNear,
  checkOptedIn,
  authorizeBurnTransaction,
  connectAlgoWallet,
};

const myAlgoWallet = new MyAlgoConnect();
let connectedAccounts: Awaited<ReturnType<typeof myAlgoWallet.connect>>;
const ALGO_UNIT = 10_000_000_000;
const GO_NEAR_ASA_ID = 83251085;

// const algodClient = new algosdk.Algodv2('', 'https://node.testnet.algoexplorerapi.io', '');
const algodClient = new algosdk.Algodv2(
  { "X-API-Key": "WLJDqY55G5560kyCJVp647ERNZ5kJkdZ8OUdGNnV" },
  "https://testnet-algorand.api.purestake.io/ps2",
  ""
);

async function connectAlgoWallet() {
  connectedAccounts = await myAlgoWallet.connect();
  return connectedAccounts;
}
/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */

/* Algorand wallet transfer function */
async function signGoNearTransaction(
  from: string,
  to: string,
  amountAlgo: number
) {
  if (from === undefined) {
    window.alert("No account, please log in again and enable browser pop-up");
    connectedAccounts = await connectAlgoWallet();
    return;
  }
  if (
    connectedAccounts === undefined ||
    connectedAccounts.length === 0 ||
    connectedAccounts.map((acc) => acc.address).indexOf(from) === -1
  ) {
    window.alert(
      "Account not logged in, please log in and enable browser pop-up"
    );
    connectedAccounts = await connectAlgoWallet();
    return;
  }

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

const requestSignGoNearTxn = async (fromAddr: string, amountStr: string) => {
  const from = fromAddr;
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
    return;
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

  setTimeout(() => {
    window.location.assign(callbackUrl);
  }, 14900);
};
