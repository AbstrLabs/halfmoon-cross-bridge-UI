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