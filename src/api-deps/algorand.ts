/**
 * This file wraps up Algorand transactions we need.
 * Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interaction
 *
 */

import { CONFIG } from "./config";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk from "algosdk";

export {
  optInGoNear,
  checkOptedIn,
  connectAlgoWallet,
  disconnectAlgoWallet,
  requestSignGoNearTxn
};

const myAlgoWallet = new MyAlgoConnect();

let algoAccount: string = localStorage.getItem("Algorand") || ""

const algodClient = new algosdk.Algodv2(
  { "X-API-Key": CONFIG.X_API_Key },
  CONFIG.ALGO_CLIENT,
  ""
);

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
  toNEARAddr: string,
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
    const enc = new TextEncoder();
    const note = enc.encode(JSON.stringify({ to_addr: toNEARAddr, to_blockchain: "NEAR" }));
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams,
      from,
      to,
      note,
      amount: amountAlgo,
      assetIndex: CONFIG.GO_NEAR_ASA_ID,
    });
    const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
    const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
    return response;
  } catch (err) {
    console.error(err);
  }
}

// transfer goNEAR
const requestSignGoNearTxn = async (algoAccount: string, amountStr: string, toNEARAddr: string) => {
  const to = CONFIG.acc.algorand_master;
  const amount = +amountStr * CONFIG.ALGO_UNIT;
  try {
    const response = await signGoNearTransaction(algoAccount, to, toNEARAddr, amount);
    if (response) return response.txId
    else return response;
  } catch (err) {
    console.error(err);
  }
};

const optInGoNear = async (addr: string) => {
  const response = await signGoNearTransaction(addr, addr, "", 0);
  if (response) return response.txId
  else return response;
};

async function checkOptedIn(addr: string, option = { showAlert: false }) {
  if (addr === undefined || addr === "") {
    window.alert("checking opted-in for empty addr");
    return false;
  }
  let accountInfo = await algodClient.accountInformation(addr).do();
  for (let assetInfo of accountInfo["assets"]) {
    if (assetInfo["asset-id"] === CONFIG.GO_NEAR_ASA_ID) {
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