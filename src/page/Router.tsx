import { BrowserRouter,Switch, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

import { DocsPage } from "./DocsPage";
import { E404Page } from "./E404Page";
import { Header } from "../component/Header";
import { HomePage } from "./HomePage";
import { ProcessPage } from "./ProcessPage";
import { ResultPage } from "./ResultPage";

export function Router() {
  /* ======== URL_QUERY ======== */

  function ScrollToTop() {
    const location = useLocation();
    const { pathname } = location;
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  useEffect(() => {
    return () => {};
    /* this is a lifecycle */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* ======== test ======== */
  // console.log("currentUrl : ", currentUrl);

  /* ======== test end ======== */

  return (
    <React.Fragment>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Switch>
          <Route path="/" element={<HomePage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/*" element={<E404Page />} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}
