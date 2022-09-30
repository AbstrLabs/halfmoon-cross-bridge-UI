import * as nearAPI from 'near-api-js';
import { CONFIG } from "./config"

export async function initContract() {
  // get network configuration values from config.js
  // based on the network ID we pass to getConfig()
  console.log(process.env.NODE_ENV)

  const nearConfig = getConfig(CONFIG.NEAR_ENV, CONFIG.CONTRACT_NAME);

  // create a keyStore for signing transactions using the user's key
  // which is located in the browser local storage after user logs in
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  // Initializing connection to the NEAR testnet
  const near = await nearAPI.connect({ keyStore, ...nearConfig });

  // Initialize wallet connection
  const wallet = new nearAPI.WalletConnection(near);

  // Load in user's account data
  let currentUser;
  if (wallet.getAccountId()) {
    currentUser = {
      // Gets the accountId as a string
      accountId: wallet.getAccountId(),
      // Gets the user's token balance
      balance: (await wallet.account().state()).amount
    }
  }
  // Initializing our contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(
    // User's accountId as a string
    wallet.account(),
    // accountId of the contract we will be loading
    // NOTE: All contracts on NEAR are deployed to an account and
    // accounts can only have one contract deployed to them.
    nearConfig.contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: ['get_request_status'],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ['add_bridge_request'],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: wallet.getAccountId(),
    }
  );

  return { contract, currentUser, nearConfig, wallet };
}

function getConfig(env, contractName) {
  switch (env) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: contractName,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      };
    case 'production':
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: contractName,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
  }
}

const nearConfig = getConfig(CONFIG.NEAR_ENV, CONFIG.CONTRACT_NAME);

const near = new nearAPI.Near({
  headers: {},
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  networkId: nearConfig.networkId,
  nodeUrl: nearConfig.nodeUrl,
  walletUrl: nearConfig.walletUrl,
});

const nearWallet = new nearAPI.WalletConnection(
  near,
  "algorand-near-bridgeTest"
);

export const nearWalletAccount = nearWallet.account();