import React, { useState } from "react";
import { styled, Button } from "@mui/material";

import { connectAlgoWallet, disconnectAlgoWallet } from "../api-deps/algorand";
import { nearWallet, connectNearWallet, disconnectNearWallet} from "../api-deps/near";
import { BridgeType } from "../api-deps/config";

export function WalletPanel({ bridgeType }: { bridgeType: BridgeType }) {

  let signedSig_NEAR = nearWallet.isSignedIn()
  let [ALGOaccount, setALGOaccount] = useState("")

  const AlgoWalletConnect = async () => {
    let acc = await connectAlgoWallet()
    setALGOaccount(acc)
  };

  return (
    <Wrap>
      {bridgeType === BridgeType.NEAR ?
        <Sec>
          {signedSig_NEAR ?
              <p>
              Connected {bridgeType} Wallet {nearWallet.account().accountId}
              </p>
            : <Button color="inherit" onClick={connectNearWallet}>
                Connect {bridgeType} Wallet 
              </Button>
          }
          {signedSig_NEAR &&
          <Button color="inherit" onClick={disconnectNearWallet}>
            Disconnect {bridgeType} wallet and Refresh
          </Button>
          }
        </Sec>
      : <Sec>
          {ALGOaccount !== "" ?
              <p>
              Connected {bridgeType} Wallet {ALGOaccount.slice(0,10)}...{ALGOaccount.slice(-5)}
              </p>
            : <Button color="inherit" onClick={AlgoWalletConnect}>
                Connect {bridgeType} Wallet 
              </Button>
          }
        </Sec>
      }
    </Wrap>
  );
}

/* ======== STYLED ======== */

const Wrap = styled("div")(() => ({
  position: "relative",
  margin: "2px",
  width: "100%",
  wrap: "pre-wrap",
  padding: "1px"
}));

const Sec = styled("div")(() => ({
  position: "relative",
  margin: "0",
  width: "100%",
  padding: "1px"
}));