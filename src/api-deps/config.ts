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
  DEFAULT_MINT_BENEFICIARY: "ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA",
  DEFAULT_MINT_AMOUNT: "1.3579",
  DEFAULT_BURN_BENEFICIARY: "abstrlabs-test.testnet",
  DEFAULT_BURN_AMOUNT: "1.2345",
}

export let REX = {
  AMOUNT_REGEX: /^[0-9]*\.?[0-9]{0,10}$/,
  ALGORAND_ADDR_REGEX: /^[2-79A-Z]{58}$/,
  NEAR_ADDR_REGEX: /^[0-9a-z][0-9a-z\-_]{2,64}.(testnet|mainnet)$/
}

export enum TokenId {
  ALGO = 'ALGO',
  NEAR = 'NEAR',
  wALGO = 'wALGO',
  goNEAR = 'goNEAR',
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
type Addr = string;
type ApiAmount = string;
type TxnId = string;

interface ApiCallParam {
  amount: ApiAmount;
  txn_id: TxnId;
  from_addr: Addr;
  from_token: TokenId; // token_id
  to_addr: Addr;
  to_token: TokenId; // token_id
}

export type { ApiCallParam };

// txn 
enum BridgeTxnStatusEnum {
  // By order
  NOT_CREATED = "NOT_CREATED", //                   Only used in ram
  ERR_SEVER_INTERNAL = "ERR_SEVER_INTERNAL", //     General server internal error
  ERR_AWS_RDS_DB = "ERR_AWS_RDS_DB", //             General AWS DB External error
  DOING_INITIALIZE = "DOING_INITIALIZE", //         BridgeTxn without calling initialize
  ERR_INITIALIZE = "ERR_INITIALIZE", //             BridgeTxn initialize failed
  DONE_INITIALIZE = "DONE_INITIALIZE", //           BridgeTxn after initialize
  DOING_INCOMING = "DOING_INCOMING", //             Await confirm incoming
  ERR_VERIFY_INCOMING = "ERR_VERIFY_INCOMING", //   Verified incoming is wrong
  ERR_TIMEOUT_INCOMING = "ERR_TIMEOUT_INCOMING", // Confirm incoming timeout
  DONE_INCOMING = "DONE_INCOMING", //               Confirm incoming success
  DOING_OUTGOING = "DOING_OUTGOING", //             Await confirm outgoing txn
  ERR_MAKE_OUTGOING = "ERR_MAKE_OUTGOING", //       Make outgoing txn failed
  DOING_VERIFY = "DOING_VERIFY", //                 Await verify outgoing txn
  ERR_CONFIRM_OUTGOING = "ERR_CONFIRM_OUTGOING", // Confirm outgoing timeout
  DONE_OUTGOING = "DONE_OUTGOING", //               Confirm outgoing success
  USER_CONFIRMED = "USER_CONFIRMED", //             User confirmed
}

interface BridgeTxnSafeObj {
  // TODO: type better (addr,txnId)
  dbId: number | string;
  fixedFeeAtom: string;
  marginFeeAtom: string;
  createdTime: string;
  fromAddr: string;
  fromAmountAtom: string;
  fromTokenId: TokenId;
  fromTxnId: string;
  toAddr: string;
  toAmountAtom: string;
  toTokenId: TokenId;
  toTxnId?: string | null;
  txnStatus: BridgeTxnStatusEnum;
}

export { BridgeTxnStatusEnum };
export type { BridgeTxnSafeObj };