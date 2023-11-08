import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Main from "./layouts/Main";
import NotFound from "./pages/NotFound";
import Login from "./Root/Login.js";
import publicRoutes from "./routes/PublicRoutes.js";
import protectedRoutes from "./routes/ProtectedRoutes";
import Context from "./Root/Context.js"; // Update the path as needed
import { TableProvider } from "../src/Context/TableContext.js"; // Import the TableProvider

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
        <Context.Provider value={{ email, setEmail }}>
          <TableProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              {protectedRoutes.map((route, index) => {
                const currentRole = localStorage.getItem("role");

                if (route.roles.includes(currentRole)) {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  );
                } else {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={<NotFound />}
                    />
                  );
                }
              })}
              {/* Add other routes as needed */}
            </Routes>
          </TableProvider>
        </Context.Provider>
      </BrowserRouter>
    </React.Fragment>
  );
}
