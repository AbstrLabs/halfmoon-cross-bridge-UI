import { Box, Tab, styled } from "@mui/material";
import React, { SyntheticEvent, useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { TxnPanel } from "./TxnPanel";
import { TxnType } from "../api-deps/config";

export function Bridge() {
  const [currentTab, setCurrentTab] = useState<TxnType>(TxnType.MINT);
  const handleTabChange = useCallback(
    (event: SyntheticEvent<Element, Event>, tabName: TxnType) => {
      setCurrentTab(tabName);
    },
    []
  );

  return (
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", margin: " 0 5%"}}>
          <TabList onChange={handleTabChange} centered>
            <Tab label={TxnType.MINT} value={TxnType.MINT} />
            <Tab label={TxnType.BURN} value={TxnType.BURN} />
          </TabList>
        </Box>
        <TabPanel value={TxnType.MINT}>
          <TxnPanel txnType={TxnType.MINT} />
        </TabPanel>
        <TabPanel value={TxnType.BURN}>
          <TxnPanel txnType={TxnType.BURN} />
        </TabPanel>
      </TabContext>
  );
}