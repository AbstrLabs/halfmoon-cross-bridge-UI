import "./index.css";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

export { TxnType, CONFIG, type ApiParam, type StringifiedBridgeTxnObject };

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <App />
  // <React.StrictMode>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
enum TxnType {
  MINT = "MINT",
  BURN = "BURN",
}
interface StringifiedBridgeTxnObject {
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

const CONFIG = {
  // apiServer: {
  //   hostname: "http://localhost",
  //   port: "4190",
  //   path: "/algorand-near",
  // },
  apiServerUrl: "http://localhost:4190/algorand-near",
  acc: {
    algorand_master:
      "JMJLRBZQSTS6ZINTD3LLSXCW46K44EI2YZHYKCPBGZP3FLITIQRGPELOBE",
    near_master: "abstrlabs.testnet",
  },
};

interface ApiParam {
  type: TxnType;
  from: string;
  txnId: string;
  to: string;
  amount: string;
}
