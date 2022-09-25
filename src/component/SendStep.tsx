import { Box, Tab } from "@mui/material";
import { SyntheticEvent, useCallback, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { SendTxnMintPanel } from "./SendTxnMintPanel";
import { SendTxnBurnPanel } from "./SendTxnBurnPanel";
import { TxnType } from "../api-deps/config";

export function SendStep({ contract, wallet }: { contract: any, wallet: any }) {

  const [currentTab, setCurrentTab] = useState<TxnType>(TxnType.MINT);
  const handleTabChange = useCallback(
    (event: SyntheticEvent<Element, Event>, tabName: TxnType) => {
      setCurrentTab(tabName);
    },
    []
  );

  return (
    <TabContext value={currentTab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", margin: " 0 5%", fontFamily: "Regular, sans-serif" }}>
        <TabList onChange={handleTabChange} centered variant="fullWidth">
          <Tab label={TxnType.MINT} value={TxnType.MINT} />
          <Tab label={TxnType.BURN} value={TxnType.BURN} />
        </TabList>
      </Box>
      <TabPanel value={TxnType.MINT}>
        <SendTxnMintPanel contract={contract} />
      </TabPanel>
      <TabPanel value={TxnType.BURN}>
        <SendTxnBurnPanel wallet={wallet} />
      </TabPanel>
    </TabContext>
  );
}