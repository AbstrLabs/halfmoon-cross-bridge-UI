import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";

import { Header } from "../component/sections/Header";
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
            <Route path="bridge" element={<BridgePage />} />
            <Route path="result" element={<ResultPage />} />
            <Route path="process" element={<ProcessPage />} />
            <Route path="*" element={<E404Page />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}
