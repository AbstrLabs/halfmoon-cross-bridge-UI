export enum TxnType {
  MINT = "MINT",
  BURN = "BURN",
}

export const CONFIG = {
  // apiServer: {
  //   hostname: "http://localhost",
  //   port: "4190",
  //   path: "/algorand-near",
  // },
  apiServerUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4190/algorand-near"
      : // "https://api.halfmooncross.com/algorand-near"
        "https://api.halfmooncross.com/algorand-near",
  acc: {
    algorand_master:
      "JMJLRBZQSTS6ZINTD3LLSXCW46K44EI2YZHYKCPBGZP3FLITIQRGPELOBE",
    near_master: "abstrlabs.testnet",
  },
};
