/**
 * This file wraps up Algorand transactions we need.
 * Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interaction
 *
 */

import { CONFIG } from "./config";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk from "algosdk";
import { TokenId } from "./config";

export {
  optInGoNear,
  checkOptedIn,
  authorizeBurnTransaction,
  connectAlgoWallet,
  disconnectAlgoWallet,
  requestSignGoNearTxn
};

const myAlgoWallet = new MyAlgoConnect();
const ALGO_UNIT = 10_000_000_000;
const GO_NEAR_ASA_ID = 83251085;
let algoAccount: string = "";

const algodClient = new algosdk.Algodv2(
  { "X-API-Key": "WLJDqY55G5560kyCJVp647ERNZ5kJkdZ8OUdGNnV" },
  "https://testnet-algorand.api.purestake.io/ps2",
  ""
);
// old param:('', 'https://node.testnet.algoexplorerapi.io', '')

async function connectAlgoWallet() {
  let connectedAccounts = await myAlgoWallet.connect();
  algoAccount = connectedAccounts[0].address;
  localStorage.setItem("Algorand", algoAccount);
  return algoAccount
}

function disconnectAlgoWallet() {
  localStorage.removeItem("Algorand")
  window.location.replace(window.location.origin + window.location.pathname);
}

/* Algorand wallet transfer function */
async function signGoNearTransaction(
  from: string,
  to: string,
  amountAlgo: number
) {
  if (from === undefined) {
    window.alert("No account, please log in again and enable browser pop-up");
    algoAccount = await connectAlgoWallet();
    return;
  }

  if (algoAccount === "") {
    window.alert(
      "Account not logged in, please log in and enable browser pop-up"
    );
    algoAccount = await connectAlgoWallet();
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

// transfer goNEAR
const requestSignGoNearTxn = async (algoAccount: string, amountStr: string) => {
  const to = CONFIG.acc.algorand_master;
  const amount = +amountStr * ALGO_UNIT;
  try {
    const response = await signGoNearTransaction(algoAccount, to, amount);
    // TODO: Err handling: no goNEAR in acc.
    return response.txId;
  } catch (err) {
    console.error(err);
  }
};

const optInGoNear = async (addr: string) => {
  const response = await signGoNearTransaction(addr, addr, 0);
  if (response) return response.txId
  else return response;
};

async function checkOptedIn(addr: string, option = { showAlert: false }) {
  if (addr === undefined || addr === "") {
    window.alert("checking opted-in for empty addr");
    return;
  }
  console.log(addr)
  let accountInfo = await algodClient.accountInformation(addr).do();
  console.log(accountInfo)
  for (let assetInfo of accountInfo["assets"]) {
    if (assetInfo["asset-id"] === GO_NEAR_ASA_ID) {
      if (option.showAlert) {
        window.alert("opted in");
      }
      console.log("opted in ")
      return true;
    }
  }
  if (option.showAlert) {
    window.alert("not opted in");
  }
  return false;
}

const authorizeBurnTransaction = async (
  burnReceiver: string,
  amount: string
) => {
  const burnSender: string = algoAccount;
  const cbUrl = new URL("/process", window.location.href);
  cbUrl.searchParams.set("from_token", TokenId.goNEAR);
  cbUrl.searchParams.set("from_addr", burnSender);
  cbUrl.searchParams.set("to_token", TokenId.NEAR);
  cbUrl.searchParams.set("to_addr", burnReceiver);
  cbUrl.searchParams.set("amount", amount);

  let txnId = await requestSignGoNearTxn(burnSender, amount);
  cbUrl.searchParams.set("txnId", txnId);

  const callbackUrl = cbUrl.toString();

  setTimeout(() => {
    window.location.assign(callbackUrl);
  }, 14900);
};
