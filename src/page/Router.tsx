import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { Header } from "../component/Header";
import { HomePage } from "./HomePage";

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
    return () => { };
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
        <Route path="/redirect" element={<HomePage />} />
        <Route path="/result" element={<HomePage />} />
        <Route path="/help" element={<HomePage />} />
      </Routes>
    </React.Fragment>
  );
}