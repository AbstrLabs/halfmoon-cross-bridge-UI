import { Typography, styled } from "@mui/material";

import {Bridge} from "../component/Bridge" 
import { ConnectWallet } from "../component/ConnectWallet";

export function HomePage() {
  return (
    <BodyWrap>
      <Typography
        variant="h2"
        component="h2"
        sx={{ 
          fontFamily: "Regular, sans-serif",
          fontSize: "72px",
          background: "linear-gradient(90.96deg, #8DFFBA 0.59%, #8CF3FC 99.19%)",
          backgroundClip: "text",
          textFillColor: "transparent" }}
        marginY="2rem"
        align="center"
      >
        Cross-Chain Bridge
      </Typography>
      <Typography
          variant="h5"
          component="h5"
          sx={{ 
            fontFamily: "Regular, sans-serif",
            fontSize: "12px",
            color:"#fff" }}
          marginY="2rem"
          align="center"
        >
          Algorand - NEAR Bridge
        </Typography>
        <ConnectWallet />
        <Bridge />
        
    </BodyWrap>
  );
}

/* ======== STYLED ======== */
const BodyWrap = styled("div")({
  flex: "1 1 auto",
  margin: "0 20px 40px",
  width: "max(50%,24rem)",
});
