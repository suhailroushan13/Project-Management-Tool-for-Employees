/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import admin from "../assets/users/admin.png";
import Context from "../Root/Context";
import AdminSiderBar from "./AdminSideBar";
import { useTableContext } from "../Context/TableContext";
import dummyImage from "../assets/users/user.png";
import axios from "axios";
import config from "../config.json";

export default function AdminProjectHeader() {
  const context = useContext(Context);
  const userEmail = context.email;
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const url = config.URL;

  const { filterInput, setFilterInput, setGlobalFilter } = useTableContext();

  let userData = localStorage.getItem("userData");
  let stringToObject = JSON.parse(userData);
  let userID = stringToObject.id;
  let fullName = stringToObject.fullName;
  let role = stringToObject.role;
  let firstName = stringToObject.firstName;
  let title = stringToObject.title;
  let profileImage = stringToObject.profileImage;
  let displayName = stringToObject.displayName;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`${url}/api/users/getimage/${userID}`);

        // Check if users array is not empty and set the image URL
        if (
          response.data &&
          response.data.users &&
          response.data.users.length > 0
        ) {
          setImagePreviewUrl(response.data.users[0].profileImage);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [userID]); // Added userID as a dependency to useEffect

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilterInput(value);
    setGlobalFilter(value); // This will set the global filter
  };

  const toggleFooterMenu = (e) => {
    e.preventDefault();
    let parent = e.target.closest(".sidebar");
    parent.classList.toggle("footer-menu-show");
  };

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
    localStorage.clear();

    // Redirect to the login page
    window.location.href = "/";
  };

  // Example usage

  return (
    <>
      <AdminSiderBar />
      <div className="header-main px-3 px-lg-4">
        <Link onClick={toggleSidebar} className="menu-link me-3 me-lg-4">
          <i className="ri-menu-2-fill"></i>
        </Link>
        <div className="form-search me-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={filterInput}
            onChange={handleFilterChange}
          />
          <i className="ri-search-line"></i>
        </div>

        <Dropdown className="dropdown-profile ms-3 ms-xl-4" align="end">
          <Dropdown.Toggle as={CustomToggle}>
            <div className="avatar online">
              <img src={imagePreviewUrl || dummyImage} alt="Fetched Profile" />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-10-f">
            <div className="dropdown-menu-body">
              <div className="avatar avatar-xl online mb-3">
                <img
                  src={imagePreviewUrl || dummyImage}
                  alt="Fetched Profile"
                />
              </div>
              <h5 className="mb-1 text-dark fw-semibold">
                {" "}
                {displayName || "Admin"}
              </h5>
              <p className="fs-sm text-secondary">
                {" "}
                {title || "Administrator"}
              </p>

              <nav className="nav">
                <Link to={`/admin/edit/${userID}`}>
                  <i className="ri-edit-2-line"></i> Edit Profile
                </Link>
                <Link to={`/admin/view/${userID}`}>
                  <i className="ri-profile-line"></i> View Profile
                </Link>
              </nav>
              <hr />
              <nav className="nav">
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
