import { styled, Button, Grid } from "@mui/material";
import React, { useState } from "react";

import { connectAlgoWallet, disconnectAlgoWallet, checkOptedIn, optInGoNear } from "../api-deps/algorand";
import { BridgeType, CONFIG } from "../api-deps/config";

export function WalletPanel({ bridgeType, wallet }: { bridgeType: BridgeType, wallet: any }) {

  let check_wallet = Object.keys(wallet).length === 0 && wallet.constructor === Object

  let signedSig_NEAR = check_wallet ? false : wallet.isSignedIn()
  let NEARaccount = check_wallet ? "" : wallet.account().accountId

  let ALGOaccount = localStorage.getItem("Algorand") || ""
  let signedSig_Algo = !!localStorage.getItem("Algorand")

  // optin
  const opt = {
    OPTEDIN: "OPTED_IN",
    NOTIN: "NOT_OPTED_IN",
    UNKNOWN: ""
  }
  const [optedIn, setTo] = useState(opt.UNKNOWN)

  // algorand functions
  const checkOptedInFunc = async (addr: string) => {
    let res = await checkOptedIn(addr)
    if (res === true) setTo(opt.OPTEDIN)
    if (res === false) setTo(opt.NOTIN)
  }

  const optInFunc = async (addr: string) => {
    const optInTxn = await optInGoNear(addr);
    if (optInTxn !== undefined) {
      console.log(
        `Beneficiary account opted in to goNEAR successfully.\nTransaction ID ${optInTxn}.`
      );
      setTo(opt.NOTIN)
    } else {
      console.log("error: " + optInTxn)
      setTo(opt.NOTIN)
    }

  }

  // near functions
  const connectNearWallet = () => {
    if (wallet.isSignedIn()) {
      console.log("already signed in")
    }
    else {
      wallet.requestSignIn(CONFIG.acc.near_master);
    }
  };

  const disconnectNearWallet = () => {
    if (wallet.isSignedIn()) {
      wallet.signOut();
      window.location.replace(window.location.origin + window.location.pathname);
    }
    else { console.log("not signed in wallet") }
  };

  return (
    <Wrap>
      {bridgeType === BridgeType.NEAR ?
        <Sec>
          {signedSig_NEAR ?
            <Grid container spacing={0}>
              <Grid item xs={12} md={8}>
                Connected {bridgeType} Wallet {NEARaccount.length < 20 ? NEARaccount : NEARaccount.slice(0, 10) + "..." + NEARaccount.slice(-7)}
              </Grid>
              <Grid item xs={12} md={4}>
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
              {optedIn === opt.NOTIN ?
                <>
                  <Button onClick={async () => optInFunc(ALGOaccount)} variant="outlined" sx={{ fontSize: "0.7rem" }}>
                    Opt in goNEAR ASA
                  </Button>
                  <p>Not opted in</p>
                </>
                : (optedIn === opt.OPTEDIN ?
                  <p>Already opted in goNEAR asset</p>
                  : <></>
                )
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