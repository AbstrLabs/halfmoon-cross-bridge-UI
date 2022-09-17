import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

import { DocsPage } from "./DocsPage";
import { E404Page } from "./E404Page";
import { Header } from "../component/sections/Header";
import { HomePage } from "./HomePage";
import { ResultPage } from "./ResultPage";

export function Router({ contract, currentUser, nearConfig, wallet }: any) {
  /* ======== URL_QUERY ======== */

  function ScrollToTop() {
    const location = useLocation();
    const { pathname } = location;
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

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
                contract={contract}
                currentUser={currentUser}
                nearConfig={nearConfig}
                wallet={wallet}
              />}
            />
            <Route path="result" element={<ResultPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="*" element={<E404Page />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}
