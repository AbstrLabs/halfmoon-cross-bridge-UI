import { Box, Tab, styled } from "@mui/material";
import React, { SyntheticEvent, useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { WalletPanel } from "./WalletPanel";
import { BridgeType } from "../api-deps/config";

export function ConnectWallet() {
  const [currentTab, setCurrentTab] = useState<BridgeType>(BridgeType.NEAR);
  const handleTabChange = useCallback(
    (event: SyntheticEvent<Element, Event>, tabName: BridgeType) => {
      setCurrentTab(tabName);
    },
    []
  );

  return (
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", margin: " 0 5%"}}>
          <TabList onChange={handleTabChange} centered>
            <Tab label={BridgeType.NEAR} value={BridgeType.NEAR} />
            <Tab label={BridgeType.ALGO} value={BridgeType.ALGO} />
          </TabList>
        </Box>
        <TabPanel value={BridgeType.NEAR}>
          <WalletPanel bridgeType={BridgeType.NEAR} />
        </TabPanel>
        <TabPanel value={BridgeType.ALGO}>
          <WalletPanel bridgeType={BridgeType.ALGO} />
        </TabPanel>
      </TabContext>
  );
}