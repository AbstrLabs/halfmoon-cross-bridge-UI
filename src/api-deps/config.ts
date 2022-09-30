export const CONFIG = {
  apiServerUrl:
    process.env.NODE_ENV === "production"
      ? "http://localhost:4190"// "https://api.halfmooncross.com"
      : "http://localhost:4190",
  apiVersion: "1.0.0",
  HostUrl: {
    MAINNET: "https://halfmooncross.com",
    TESTNET: "https://testnet.halfmooncross.com",
    DEV: "http://localhost:3000"
  },
  DocUrl: "https://docs.halfmooncross.com",
  acc: {
    algorand_master:
      process.env.NODE_ENV === "production"
        ? "JOXRNLAAFF2MDM6CI23XATPZJUJRQAM6X5QH227HSWMDC2JXZCTEBZ2OEI"
        : "JMJLRBZQSTS6ZINTD3LLSXCW46K44EI2YZHYKCPBGZP3FLITIQRGPELOBE",
    near_master: process.env.NODE_ENV === "production"
      ? "halfmooncross.near"
      : "abstrlabs.testnet",
  },
  GO_NEAR_ASA_ID: process.env.NODE_ENV === "production" ? 885797225 : 83251085,
  ALGO_UNIT: 10_000_000_000,
  ALGO_CLIENT: process.env.NODE_ENV === "production" ? "https://mainnet-algorand.api.purestake.io/ps2" : "https://testnet-algorand.api.purestake.io/ps2",
  X_API_Key: "WLJDqY55G5560kyCJVp647ERNZ5kJkdZ8OUdGNnV",
  CONTRACT_NAME: process.env.NODE_ENV === "production" ? 'halfmooncross.near' : 'halfmooncross2.testnet',
  NEAR_ENV: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet'
};

// links
export let Links = {

  AlgorandAddress: process.env.NODE_ENV === "production" ?
    "https://algoexplorer.io/address/"
    : "https://testnet.algoexplorer.io/address/",
  AlgorandTxn: process.env.NODE_ENV === "production" ?
    "https://algoexplorer.io/tx/"
    : "https://testnet.algoexplorer.io/tx/",
  NearAddress: process.env.NODE_ENV === "production" ?
    "https://explorer.near.org/accounts/"
    : "https://explorer.testnet.near.org/accounts/",
  NearTxn: process.env.NODE_ENV === "production" ?
    "https://explorer.near.org/transactions/"
    : "https://explorer.testnet.near.org/transactions/"

}

export enum TxnType {
  MINT = "MINT",
  BURN = "BURN",
}

export enum BridgeType {
  NEAR = "NEAR",
  ALGO = "Algorand"
}

export let DEFAULT = {
  DEFAULT_MINT_BENEFICIARY: "Z2TYCC3CSH3GDIYD25MUXMPR4C2UZCDCLJ6E3YTVTYD2EZB2QUN6VDXN7E",
  DEFAULT_MINT_AMOUNT: "1.3579",
  DEFAULT_BURN_BENEFICIARY: "abstrlabs.testnet",
  DEFAULT_BURN_AMOUNT: "1.2345",
  DEFAULT_NEAR_TXN_HASH: "AfKuCQKP78691ygVwwhkKjuW982NSsE3P6AhR2SjYykS",
  DEFAULT_ALGORAND_TXN_HASH: "AUCI2MXT3WKV6YPMPGR4FTBQR25IYVSOXIMD2RLGOCYUYYGAMHCQ"
}

export let REX = {
  AMOUNT_REGEX: /^[0-9]*\.?[0-9]{0,10}$/,
  ALGORAND_ADDR_REGEX: /^[2-79A-Z]{58}$/,
  NEAR_ADDR_REGEX: /^[0-9a-z][0-9a-z\-_]{2,64}.(testnet|mainnet)$/,
  NEAR_TRANSACTION_REGEX: /^[2-79A-Z]{44}$/,
  ALGORAND_TRANSACTION_REGEX: /^[2-79A-Z]{52}$/
}

export enum TokenId {
  ALGO = 'ALGO',
  NEAR = 'NEAR',
  wALGO = 'wALGO',
  goNEAR = 'goNEAR',
}

export enum TokenUID {
  NEAR = 2,
  Algorand = 3
}

export enum FROM_AMOUNT_ATOM {
  NEAR = '000000000000000000000000',
  goNEAR = '0000000000',
  ALGO = '000000'
}

export enum FeeText {
  MINT = "0.001 NEAR",
  BURN = "0.002% amount + 0.001 goNEAR",
}

export enum ReceivingPropotion {
  MINT = 1,
  BURN = 0.998,
}

export enum FeePortion {
  MINT = 0.001,
  BURN = 0.001
}

// Api call param

interface ApiCallParam {
  from_addr: string,
  from_token_id: number,
  from_txn_hash: string,
  to_token_id: number,
  comment?: string
}

export type { ApiCallParam };

// txn 
enum BridgeTxnStatusEnum {
  // By order
  CREATED = 'CREATED',
  INVALID = 'INVALID',
  DONE_VERIFY = 'DONE_VERIFY',
  ERROR_IN_VERIFY = 'ERROR_IN_VERIFY',
  DOING_OUTGOING = 'DOING_OUTGOING',
  DONE_OUTGOING = 'DONE_OUTGOING',
  ERROR_IN_OUTGOING = 'ERROR_IN_OUTGOING'
}

interface BridgeTxnSafeObj {
  created_time: string;
  from_addr: string;
  from_amount: string;
  from_token_id: TokenId;
  from_txn_hash: string;
  to_addr: string;
  to_amount: string;
  to_token_id: TokenId;
  to_txn_hash: string;
}

interface FeeObj {
  fixedFeeAtom: string;
  marginFeeAtom: string;
}

export { BridgeTxnStatusEnum };
export type { BridgeTxnSafeObj, FeeObj };

export const GET_INTERVAL_MS = 3000;
