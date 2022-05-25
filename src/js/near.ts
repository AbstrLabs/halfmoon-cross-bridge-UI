import * as nearAPI from "near-api-js";

import { checkOptedIn, optInGoNear } from "./algorand";

import { CONFIG } from "./config";

export { nearWallet, authorizeMintTransaction };
// const receiverId = "abstrlabs.testnet";
// const amountStr = "1.56789";

const near = new nearAPI.Near({
  headers: {},
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
});

const nearWallet = new nearAPI.WalletConnection(
  near,
  "algorand-near-bridgeTest"
);
const nearWalletAccount = nearWallet.account();

async function createNearTxn({
  receiverId,
  amountStr,
}: {
  receiverId: string;
  amountStr: string;
}) {
  // create txn
  const action = nearAPI.transactions.transfer(
    nearAPI.utils.format.parseNearAmount(amountStr)
  );

  // const walletAcc = nearWallet.account();
  const ak = await nearWalletAccount.findAccessKey(
    nearWallet.getAccountId(),
    []
  );
  // assert ak none null
  const recentBlockHash = nearAPI.utils.serialize.base_decode(
    // https://docs.near.org/docs/tutorials/create-transactions#6-blockhash
    ak.accessKey.block_hash
  );

  const tx = new nearAPI.transactions.Transaction({
    signerId: nearWallet.getAccountId(),
    publicKey: ak.publicKey,
    nonce: ++ak.accessKey.nonce,
    receiverId,
    actions: [action],
    blockHash: recentBlockHash,
  });
  return tx;
}

async function requestSignNearTxn(
  amountStr: string,
  callbackUrl: string | undefined = undefined
) {
  let tx = await createNearTxn({
    receiverId: CONFIG.acc.near_master,
    amountStr,
  });
  nearWallet.requestSignTransactions({ transactions: [tx], callbackUrl });
}

async function authorizeMintTransaction(
  amountStr: string,
  mintReceiver: string
) {
  let firstTimeCheckOptedIn = true;
  while (!(await checkOptedIn(mintReceiver))) {
    if (!firstTimeCheckOptedIn) {
      window.alert(
        "Seems you opted in another account rather than the receiver "
      );
    }
    let optInOption = window.confirm(
      "Beneficiary account have not opted in to goNEAR, opt in now?"
    );
    if (!optInOption) {
      return;
    }
    const optInTxnId = await optInGoNear(mintReceiver);
    window.alert(
      `Beneficiary account opted in to goNEAR successfully.\nTransaction ID ${optInTxnId}.`
    );
    firstTimeCheckOptedIn = false;
  }
  const cbUrl = new URL("/process", window.location.href);
  cbUrl.searchParams.set("type", "MINT");
  cbUrl.searchParams.set("amount", amountStr);
  cbUrl.searchParams.set("to", mintReceiver);
  cbUrl.searchParams.set("from", nearWallet.getAccountId().toString());
  const callbackUrl = cbUrl.toString();
  await requestSignNearTxn(amountStr, callbackUrl);
  return;
}
