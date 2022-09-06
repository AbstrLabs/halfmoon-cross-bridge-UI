import { styled, Button } from "@mui/material";

import { connectAlgoWallet, disconnectAlgoWallet } from "../api-deps/algorand";
import { nearWallet, connectNearWallet, disconnectNearWallet} from "../api-deps/near";
import { BridgeType } from "../api-deps/config";

export function WalletPanel({ bridgeType }: { bridgeType: BridgeType }) {

  let signedSig_NEAR = nearWallet.isSignedIn()
  let NEARaccount = nearWallet.account().accountId || ""
  let ALGOaccount = localStorage.getItem("Algorand") || ""
  let signedSig_Algo = !!localStorage.getItem("Algorand")

  return (
    <Wrap>
      {bridgeType === BridgeType.NEAR ?
        <Sec>
          {signedSig_NEAR ?
              <div>
              Connected {bridgeType} Wallet {NEARaccount.length < 20 ? NEARaccount : NEARaccount.slice(0,10) + "..." + NEARaccount.slice(-7)}
              <Button color="inherit" onClick={disconnectNearWallet}>
                Disconnect {bridgeType} wallet and Refresh
              </Button>
              </div>
            : <Button color="inherit" onClick={connectNearWallet}>
                Connect {bridgeType} Wallet 
              </Button>
          }
        </Sec>
      : <Sec>
          {signedSig_Algo ?
              <div>
              Connected {bridgeType} Wallet {ALGOaccount.slice(0,10)}...{ALGOaccount.slice(-5)}
              <Button color="inherit" onClick={disconnectAlgoWallet}>
                Disconnect {bridgeType} wallet and Refresh
              </Button>
            </div>
            : <Button color="inherit" onClick={async () =>{
                await connectAlgoWallet()
                window.location.reload()
                }}>
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