import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useCallback, useState } from "react";

import { initContract } from "../api-deps/near";

import { Header } from "../component/sections/Header";
import { DocsPage } from "./DocsPage";
import { E404Page } from "./E404Page";
import { BridgePage } from "./BridgePage";
import { ResultPage } from "./ResultPage";
import { ProcessPage } from "./ProcessPage";
import { HomePage } from "./HomePage"

export function Router() {
  /* ======== URL_QUERY ======== */

  function ScrollToTop() {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    return null;
  }

  let [near, setNear] = useState({ contract: {}, config: {}, wallet: {} })

  let check = useCallback(async () => {
    let contractRes = await initContract()
    setNear({
      contract: contractRes.contract,
      config: contractRes.nearConfig,
      wallet: contractRes.wallet
    })
  }, [])

  useEffect(() => {
    check()
    console.log(`near contract inited`)
  }, [])

  /* ======== test end ======== */
  return (
    <React.Fragment>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/">
            <Route index element={
              <HomePage />}
            />
            <Route path="bridge" element={<BridgePage
              contract={near.contract}
              config={near.config}
              wallet={near.wallet}
            />} />
            <Route path="result" element={<ResultPage />} />
            <Route path="process" element={<ProcessPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="*" element={<E404Page />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}
