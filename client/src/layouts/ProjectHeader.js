import React, { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import UserContext from "../Root/Context";
import dummyImage from "../assets/users/user.png";
import Sidebar from "./Sidebar";

import LeadsData from "../data/Leads";

export default function ProjectHeader({ onSkin }) {
  const context = useContext(UserContext);
  const userEmail = context.email;

  const retrievedUser = leadsData.find((lead) => lead.email === userEmail);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser && savedUser !== "undefined"
      ? JSON.parse(savedUser)
      : leadsData.find((lead) => lead.email === userEmail);
  });

  const [userImage, setUserImage] = useState(() => {
    const savedImage = localStorage.getItem("userImage");
    return savedImage && savedImage !== "undefined"
      ? savedImage
      : user
      ? user.path
      : dummyImage;
  });

  useEffect(() => {
    localStorage.setItem("userImage", userImage);
  }, [user, userImage]);

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      to=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="dropdown-link"
    >
      {children}
    </Link>
  ));

  const toggleSidebar = (e) => {
    e.preventDefault();
    let isOffset = document.body.classList.contains("sidebar-offset");
    if (isOffset) {
      document.body.classList.toggle("sidebar-show");
    } else {
      if (window.matchMedia("(max-width: 991px)").matches) {
        document.body.classList.toggle("sidebar-show");
      } else {
        document.body.classList.toggle("sidebar-hide");
      }
    }
  };

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    localStorage.removeItem("userImage");

    // Redirect to the login page
    window.location.href = "/";
  };

  return (
    <>
      <Sidebar></Sidebar>
      <div className="header-main px-3 px-lg-4">
        <Link onClick={toggleSidebar} className="menu-link me-3 me-lg-4">
          <i className="ri-menu-2-fill"></i>
        </Link>
        <div className="form-search me-auto">
          <input type="text" className="form-control" placeholder="Search" />
          <i className="ri-search-line"></i>
        </div>

        <Dropdown className="dropdown-profile ms-3 ms-xl-4" align="end">
          <Dropdown.Toggle as={CustomToggle}>
            <div className="avatar online">
              <img src={userImage} alt={user ? user.name : "Default User"} />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-10-f">
            <div className="dropdown-menu-body">
              <div className="avatar avatar-xl online mb-3">
                <img src={userImage} alt={user ? user.name : "Default User"} />
              </div>
              <h5 className="mb-1 text-dark fw-semibold">
                {" "}
                {user ? user.name : "Admin"}
              </h5>
              <p className="fs-sm text-secondary">
                {" "}
                {user ? user.role : "Employee"}
              </p>

              <nav className="nav">
                <Link to="">
                  <i className="ri-edit-2-line"></i> Edit Profile
                </Link>
                <Link to="">
                  <i className="ri-profile-line"></i> View Profile
                </Link>
              </nav>
              <hr />
              <nav className="nav">
                <Link to="">
                  <i className="ri-question-line"></i> Help Center
                </Link>
                <Link to="">
                  <i className="ri-lock-line"></i> Privacy Settings
                </Link>
                <Link to="">
                  <i className="ri-user-settings-line"></i> Account Settings
                </Link>
                <Link to="/" onClick={handleLogout}>
                  <i className="ri-logout-box-r-line"></i> Log Out
                </Link>
              </nav>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}
