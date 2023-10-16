import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Main from "./layouts/Main";
import NotFound from "./pages/NotFound";
import Login from "./dashboard/Login";
import publicRoutes from "./routes/PublicRoutes.js";
import protectedRoutes from "./routes/ProtectedRoutes";
import UserContext from "./dashboard/UserContext.js"; // Update the path as needed

// import css
import "./assets/css/remixicon.css";

// import scss
import "./scss/style.scss";

// set skin on load
window.addEventListener("load", function () {
  let skinMode = localStorage.getItem("skin-mode");
  let HTMLTag = document.querySelector("html");

  if (skinMode) {
    HTMLTag.setAttribute("data-skin", skinMode);
  }
});

export default function App() {
  const [email, setEmail] = useState("");

  return (
    <React.Fragment>
      <BrowserRouter>
        <UserContext.Provider value={{ email, setEmail }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/" element={<Main />}>
              {protectedRoutes.map((route, index) => {
                return (
                  <Route
                    path={route.path}
                    element={route.element}
                    key={index}
                  />
                );
              })}
            </Route>
            {publicRoutes.map((route, index) => {
              return (
                <Route path={route.path} element={route.element} key={index} />
              );
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </React.Fragment>
  );
}
