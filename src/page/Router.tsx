import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { E404Page } from "./E404Page";
import { Header } from "../component/Header";
import { HomePage } from "./HomePage";
import { ProcessPage } from "./ProcessPage";
import { ResultPage } from "./ResultPage";

export function Router() {
  /* ======== URL_QUERY ======== */
  const location = useLocation();

  function ScrollToTop() {
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
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/help" element={<HomePage />} />
        <Route path="*" element={<E404Page />} />
      </Routes>
    </React.Fragment>
  );
}
