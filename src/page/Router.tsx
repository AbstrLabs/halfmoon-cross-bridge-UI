import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect, useCallback, useState } from "react";

import { DocsPage } from "./DocsPage";
import { E404Page } from "./E404Page";
import { Header } from "../component/sections/Header";
import { HomePage } from "./HomePage";
import { ResultPage } from "./ResultPage";
import { ProcessPage } from "./ProcessPage";
import { initContract } from "../api-deps/near/contract"

export function Router() {
  /* ======== URL_QUERY ======== */

  function ScrollToTop() {
    const location = useLocation();
    const { pathname } = location;
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    return null;
  }

  let [near, setNear] = useState({ contract: {}, accountId: "" })

  let check = useCallback(async () => {
    let contractRes = await initContract()
    setNear({ contract: contractRes.contract, accountId: contractRes.currentUser?.accountId })
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
              <HomePage
                contract={near.contract}
                accountId={near.accountId}
              />}
            />
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
