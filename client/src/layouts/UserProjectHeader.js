/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import dummyImage from "../assets/users/user.png";
import Context from "../Root/Context";
import UserSiderBar from "./UserSideBar";
import { leadsData } from "../data/Leads";
import { useTableContext } from "../Context/TableContext";
import axios from "axios";
import config from "../config.json";

export default function UserProjectHeader() {
  const context = useContext(Context);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const userEmail = context.email;
  const { filterInput, setFilterInput, setGlobalFilter } = useTableContext();
  const url = config.URL;
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
          setImagePreviewUrl(response.data.users[0].profileImage || dummyImage);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [userID]); // Added userID as a dependency to useEffect

  const [user, setUser] = useState(null);

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilterInput(value);
    setGlobalFilter(value); // This will set the global filter
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      console.log(parsedUser.fullName); // Now it's guaranteed that parsedUser is defined
    } else {
      const foundUser = leadsData.find((lead) => lead.email === userEmail);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
      }
    }
  }, [userEmail]);

  const toggleSidebar = (e) => {
    e.preventDefault();
    const isOffset = document.body.classList.contains("sidebar-offset");
    const shouldShowSidebar =
      isOffset || window.matchMedia("(max-width: 991px)").matches;

    document.body.classList.toggle(
      shouldShowSidebar ? "sidebar-show" : "sidebar-hide"
    );
  };

  const handleLogout = () => {
    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <>
      <UserSiderBar />
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
                {displayName || "Employee"}
              </h5>
              <p className="fs-sm text-secondary"> {title || "Employee"}</p>

              <nav className="nav">
                <Link to={`/user/edit/${userID}`}>
                  <i className="ri-edit-2-line"></i> Edit Profile
                </Link>
                <Link to={`/user/view/${userID}`}>
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
