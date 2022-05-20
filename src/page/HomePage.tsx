import { Box, Tab, Typography, styled } from "@mui/material";
import { Download, Upload } from "@mui/icons-material";
import React, { SyntheticEvent, useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export function HomePage() {
  /* ======== MUI ======== */
  enum TabName {
    MINT = "MINT",
    BURN = "BURN",
  }
  const [currentTab, setCurrentTab] = useState<TabName>(TabName.MINT);
  const handleTabChange = useCallback(
    (event: SyntheticEvent<Element, Event>, tabName: TabName) => {
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
      >
        Algorand - Near Bridge
      </Typography>
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} centered>
            <Tab
              icon={<Download />}
              label={TabName.MINT}
              value={TabName.MINT}
            />
            <Tab icon={<Upload />} label={TabName.BURN} value={TabName.BURN} />
          </TabList>
        </Box>
        <TabPanel value={TabName.MINT}>MINT TO</TabPanel>
        <TabPanel value={TabName.BURN}>BURN TO</TabPanel>
      </TabContext>
    </BodyWrap>
  );
}

/* ======== STYLED ======== */
const BodyWrap = styled("div")({
  flex: "1 1 auto",
  margin: "0 20px 40px",
});
const CardsWrap = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "20px 0 0",
  display: "flex",
  maxWidth: "100%",
  padding: "10px",
  backgroundColor: theme.palette.background.default,
}));
