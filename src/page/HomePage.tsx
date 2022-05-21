import { Box, Tab, Typography, styled } from "@mui/material";
import { Download, Upload } from "@mui/icons-material";
import React, { SyntheticEvent, useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { TxnPanel } from "../component/large-components/TxnPanel";
import { TxnType } from "..";

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
        margin="2rem auto 4rem"
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
          <TxnPanel txnType={TxnType.MINT} />
        </TabPanel>
        <TabPanel value={TxnType.BURN}>
          <TxnPanel txnType={TxnType.BURN} />
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