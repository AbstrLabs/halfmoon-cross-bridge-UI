import { Box, Tab, Typography, styled } from "@mui/material";
import { Download, Upload } from "@mui/icons-material";
import React, { SyntheticEvent, useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import PanelContextProvider from "../context/panel";
import { TxnPanel } from "../component/TxnPanel";
import { TxnType } from "../api-deps/config";

export function HomePage() {
  const [currentTab, setCurrentTab] = useState<TxnType>(TxnType.MINT);
  const handleTabChange = useCallback(
    (event: SyntheticEvent<Element, Event>, tabName: TxnType) => {
      setCurrentTab(tabName);
    },
    []
  );

  return (
    <BodyWrap>
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontSize: "1rem", fontWeight: 800 }}
        marginY="2rem"
        align="center"
      >
        Algorand - Near Bridge
      </Typography>
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} centered>
            <Tab
              icon={<Download />}
              label={TxnType.MINT}
              value={TxnType.MINT}
            />
            <Tab icon={<Upload />} label={TxnType.BURN} value={TxnType.BURN} />
          </TabList>
        </Box>
        <TabPanel value={TxnType.MINT}>
          <PanelContextProvider txnType={TxnType.MINT}>
            <TxnPanel />
          </PanelContextProvider>
        </TabPanel>
        <TabPanel value={TxnType.BURN}>
          <PanelContextProvider txnType={TxnType.BURN}>
            <TxnPanel />
          </PanelContextProvider>
        </TabPanel>
      </TabContext>
    </BodyWrap>
  );
}

/* ======== STYLED ======== */
const BodyWrap = styled("div")({
  flex: "1 1 auto",
  margin: "0 20px 40px",
  width: "max(50%,24rem)",
});
