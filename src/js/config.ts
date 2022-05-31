export enum TxnType {
  MINT = "MINT",
  BURN = "BURN",
}

export interface StringifiedBridgeTxnObject {
  // from bridge-txn.ts
  dbId: string;
  fixedFeeAtom: string;
  marginFeeAtom: string;
  createdTime: string;
  fromAddr: string;
  fromAmountAtom: string;
  // fromBlockchain: BlockchainName;
  fromTxnId: string;
  toAddr: string;
  toAmountAtom: string;
  // toBlockchain: BlockchainName;
  toTxnId: string;
  // txnStatus: BridgeTxnStatus;
  txnType: TxnType;
}

export const CONFIG = {
  // apiServer: {
  //   hostname: "http://localhost",
  //   port: "4190",
  //   path: "/algorand-near",
  // },
  apiServerUrl:
    process.env.NODE_ENV === "development"
      // ? "http://localhost:4190/algorand-near"
      ? "https://api.halfmooncross/algorand-near"
      : "https://api.halfmooncross/algorand-near",
  acc: {
    algorand_master:
      "JMJLRBZQSTS6ZINTD3LLSXCW46K44EI2YZHYKCPBGZP3FLITIQRGPELOBE",
    near_master: "abstrlabs.testnet",
  },
};

export interface ApiParam {
  type: TxnType;
  from: string;
  txnId: string;
  to: string;
  amount: string;
}

  