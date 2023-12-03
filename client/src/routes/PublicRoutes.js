import React from "react";

import ForgotPassword from "../pages/ForgotPassword";

import VerifyAccount from "../pages/VerifyAccount";

const publicRoutes = [
  { path: "/verify-otp", element: <VerifyAccount /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
];

export default publicRoutes;
