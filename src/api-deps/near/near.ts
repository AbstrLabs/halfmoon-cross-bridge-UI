/**
 * This file wraps up NEAR transactions we need.
 */
import * as nearAPI from "near-api-js";

import { CONFIG } from "../config";

export {
  nearWallet,
  connectNearWallet,
  disconnectNearWallet
};

const near = new nearAPI.Near({
  headers: {},
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
});

const nearWallet = new nearAPI.WalletConnection(
  near,
  "algorand-near-bridge"
);

function connectNearWallet() {
  if (nearWallet.isSignedIn()) {
    console.log("already signed in")
    console.log(nearWallet.account());
  } else {
    nearWallet.requestSignIn(CONFIG.acc.near_master);
  }
}

function disconnectNearWallet() {
  if (nearWallet.isSignedIn()) {
    console.log("sign out the near wallet")
    nearWallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  } else {
    console.log("no connected wallet")
  }
}

