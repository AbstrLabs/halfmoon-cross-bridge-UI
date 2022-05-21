import "./index.css";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

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

export enum TxnType {
  MINT = "MINT",
  BURN = "BURN",
}

export const CONFIG = {
  apiServer: {
    hostname: "http://localhost",
    port: "4190",
    mintPath: "/api/mint",
  },
  acc: {
    algorand_master:
      "JMJLRBZQSTS6ZINTD3LLSXCW46K44EI2YZHYKCPBGZP3FLITIQRGPELOBE",
    near_master: "abstrlabs.testnet",
  },
};
