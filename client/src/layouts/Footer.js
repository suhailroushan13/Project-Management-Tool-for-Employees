import React from "react";
import { Link } from "react-router-dom";

import config from "../config.json";
export default function Footer() {
  // Get the current year dynamically
  let version = config.VERSION;
  const currentYear = new Date().getFullYear();

  return (
    <div className="main-footer">
      <span>
        &copy; {currentYear} T-Works. All Rights Reserved. Version - {version}
      </span>
      <span>
        Created by:{" "}
        <Link to="https://tworks.in" target="_blank">
          T-Works
        </Link>
      </span>
    </div>
  );
}
