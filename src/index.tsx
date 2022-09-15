import "./index.css";

//font
import "./font/Supply-Regular.otf"
import "./font/Supply-Light.otf"
import "./font/Supply-UltraLight.otf"
import "./font/Supply-Medium.otf"
import "./font/Supply-Bold.otf"

// config
import App from "./App";
import ReactDOM from "react-dom/client";
import { CONFIG } from "./api-deps/config";
import { initContract } from "./api-deps/near/contract"

async function checkApiVersion() {
  const res = await fetch(CONFIG.apiServerUrl + '/status');
  const resJson = await res.json();
  if (resJson.API_VERSION !== CONFIG.apiVersion) {
    window.alert(
      `API version mismatch, expected ${CONFIG.apiVersion}, got ${resJson.API_VERSION}`
    );
    throw new Error("API version mismatch");
  }
}

// checkApiVersion()
//   .then(() => {
//     console.log(
//       `API version check passed. Current version: ${CONFIG.apiVersion}`
//     );
//   })
//   .catch((err) => {
//     console.error(err);
//     console.error(`Failed to check API version. Error: ${err.message}`);
//   });

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

initContract().then(
  ({ contract, currentUser, nearConfig, walletConnection }) => {
    root.render(
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
      />
    )
  }
);
