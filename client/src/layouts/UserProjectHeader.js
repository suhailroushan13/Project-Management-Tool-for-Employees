/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import dummyImage from "../assets/users/user.png";
import Context from "../Root/Context";
import UserSiderBar from "./UserSideBar";
import { leadsData } from "../data/Leads";
import { useTableContext } from "../Context/TableContext";

export default function UserProjectHeader() {
  const context = useContext(Context);
  const userEmail = context.email;
  const { filterInput, setFilterInput, setGlobalFilter } = useTableContext();

  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(dummyImage);
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilterInput(value);
    setGlobalFilter(value); // This will set the global filter
  };

  let myUser;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedImage = localStorage.getItem("userImage");

    if (savedUser && savedImage) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setUserImage(savedImage);
      console.log(parsedUser.fullName); // Now it's guaranteed that parsedUser is defined
    } else {
      const foundUser = leadsData.find((lead) => lead.email === userEmail);
      if (foundUser) {
        setUser(foundUser);
        setUserImage(foundUser.path);
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("userImage", foundUser.path);
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
              <img src={userImage} alt={user ? user.name : "Default User"} />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-10-f">
            <div className="dropdown-menu-body">
              <div className="avatar avatar-xl online mb-3">
                <img src={userImage} alt={user ? user.name : ""} />
              </div>
              <h5 className="mb-1 text-dark fw-semibold">
                {user ? user.fullName : "Default User"}
              </h5>
              <p className="fs-sm text-secondary">{user ? user.role : ""}</p>
              <nav className="nav">
                <Link to="/user/view">
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
