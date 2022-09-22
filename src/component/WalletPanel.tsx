import { styled, Button, Grid } from "@mui/material";
import React, { useState } from "react";

import { connectAlgoWallet, disconnectAlgoWallet, checkOptedIn, optInGoNear } from "../api-deps/algorand";
import { nearWallet, connectNearWallet, disconnectNearWallet } from "../api-deps/near/near";
import { BridgeType } from "../api-deps/config";

export function WalletPanel({ bridgeType }: { bridgeType: BridgeType }) {

  let signedSig_NEAR = nearWallet.isSignedIn()
  let NEARaccount = nearWallet.account().accountId || ""
  let ALGOaccount = localStorage.getItem("Algorand") || ""
  let signedSig_Algo = !!localStorage.getItem("Algorand")

  const [notOptIn, setTo] = useState(true)

  const checkOptedInFunc = async (addr: string) => {
    let res = await checkOptedIn(ALGOaccount)
    if (res === true) setTo(false)
  }

  const optInFunc = async (addr: string) => {
    const optInTxn = await optInGoNear(addr);
    if (optInTxn !== undefined) {
      console.log(
        `Beneficiary account opted in to goNEAR successfully.\nTransaction ID ${optInTxn}.`
      );
    } else {
      console.log("error: " + optInTxn)
    }

  }

  return (
    <Wrap>
      {bridgeType === BridgeType.NEAR ?
        <Sec>
          {signedSig_NEAR ?
            <Grid container spacing={0}>
              <Grid item xs={12} md={8}>
                Connected {bridgeType} Wallet {NEARaccount.length < 20 ? NEARaccount : NEARaccount.slice(0, 10) + "..." + NEARaccount.slice(-7)}
              </Grid>
              <Grid item xs={12} md={3}>
                <Button onClick={disconnectNearWallet} variant="outlined" sx={{ fontSize: "0.7rem" }}>
                  Disconnect {bridgeType} wallet
                </Button>
              </Grid>
            </Grid>
            : <Button onClick={connectNearWallet} variant="outlined" >
              Connect {bridgeType} wallet
            </Button>
          }
        </Sec>
        : <Sec>
          {signedSig_Algo ?
            <Grid container spacing={0}>
              <Grid item xs={12} md={10}>
                Connected {bridgeType} Wallet {ALGOaccount.slice(0, 10)}...{ALGOaccount.slice(-5)}
              </Grid>
              <Grid item xs={6} md={4}>
                <Button onClick={disconnectAlgoWallet} variant="outlined" sx={{ fontSize: "0.7rem" }}>
                  Disconnect {bridgeType} wallet
                </Button>
              </Grid>
              <Grid item xs={6} md={5}>
                <Button onClick={async () => await checkOptedInFunc(ALGOaccount)} variant="outlined" sx={{ fontSize: "0.7rem" }}>
                  Check {bridgeType} address opt in goNEAR
                </Button>
              </Grid>
              {notOptIn ?
                <Button onClick={async () => optInFunc(ALGOaccount)} variant="outlined" sx={{ fontSize: "0.7rem" }}>
                  Opt in goNEAR ASA
                </Button>
                : <p>Already opted in goNEAR asset</p>
              }
            </Grid>
            : <Button onClick={async () => {
              await connectAlgoWallet()
              window.location.reload()
            }}
              variant="outlined">
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
  paddingLeft: "30px"
}));

const Sec = styled("div")(() => ({
  position: "relative",
  margin: "0",
  width: "100%"
}));