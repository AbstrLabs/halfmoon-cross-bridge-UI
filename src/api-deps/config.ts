export const CONFIG = {
  apiServerUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4190"
      : "https://api.halfmooncross.com",
  apiVersion: "1.0.0",
  acc: {
    algorand_master:
      "JMJLRBZQSTS6ZINTD3LLSXCW46K44EI2YZHYKCPBGZP3FLITIQRGPELOBE",
    near_master: "abstrlabs.testnet",
  },
};

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
  DEFAULT_BURN_BENEFICIARY: "abstrlabs-test.testnet",
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
  MINT = "0.0%+1",
  BURN = "0.2%+1",
}

export enum ReceivingPropotion {
  MINT = 1,
  BURN = 0.998,
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
  from_amount_atom: string;
  from_token_id: TokenId;
  from_txn_hash: string;
  to_addr: string;
  to_amount_atom: string;
  to_token_id: TokenId;
  to_txn_hash: string;
}

interface FeeObj {
  fixedFeeAtom: string;
  marginFeeAtom: string;
}

export { BridgeTxnStatusEnum };
export type { BridgeTxnSafeObj };

export const GET_INTERVAL_MS = 3000;