import React, { useContext, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../Root/Context";
import anand from "../assets/users/anand.png";
import firoz from "../assets/users/firoz.jpg";
import meera from "../assets/users/meera.jpg";
import raj from "../assets/users/raj.png";
import sanjay from "../assets/users/sanjay.png";
import dummyImage from "../assets/users/user.png";
import veera from "../assets/users/veera.png";
import { leadsData } from "../data/Leads";
import { dashboardMenu } from "../data/Menu";

const Sidebar = () => {
  const context = useContext(UserContext);
  const userEmail = context.email;

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser && savedUser !== "undefined"
      ? JSON.parse(savedUser)
      : leadsData.find((lead) => lead.email === userEmail);
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const toggleFooterMenu = (e) => {
    e.preventDefault();
    let parent = e.target.closest(".sidebar");
    parent.classList.toggle("footer-menu-show");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          T-Works
        </Link>
      </div>
      <PerfectScrollbar className="sidebar-body">
        <SidebarMenu />
      </PerfectScrollbar>
      <div className="sidebar-footer">
        <div className="sidebar-footer-top">
          <div className="sidebar-footer-thumb">
            <img alt={user ? user.name : "Default User"} />
          </div>
          <div className="sidebar-footer-body">
            <h6>{user ? user.name : "Admin"}</h6>
            {user ? user.role : "Employee"}
          </div>
          <Link onClick={toggleFooterMenu} to="" className="dropdown-link">
            <i className="ri-arrow-down-s-line"></i>
          </Link>
        </div>
        <div className="sidebar-footer-menu">
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
      </div>
    </div>
  );
};

const SidebarMenu = () => {
  const populateMenu = (m) => {
    const menu = m.map((m, key) => {
      let sm;
      if (m.submenu) {
        sm = m.submenu.map((sm, key) => {
          return (
            <NavLink to={sm.link} className="nav-sub-link" key={key}>
              {sm.label}
            </NavLink>
          );
        });
      }

      return (
        <li key={key} className="nav-item">
          {!sm ? (
            <NavLink to={m.link} className="nav-link">
              <i className={m.icon}></i> <span>{m.label}</span>
            </NavLink>
          ) : (
            <div onClick={toggleSubMenu} className="nav-link has-sub">
              <i className={m.icon}></i> <span>{m.label}</span>
            </div>
          )}
          {m.submenu && <nav className="nav nav-sub">{sm}</nav>}
        </li>
      );
    });

    return <ul className="nav nav-sidebar">{menu}</ul>;
  };

  // Toggle submenu while closing siblings' submenu
  const toggleSubMenu = (e) => {
    e.preventDefault();

    let parent = e.target.closest(".nav-item");
    let node = parent.parentNode.firstChild;

    while (node) {
      if (node !== parent && node.nodeType === Node.ELEMENT_NODE)
        node.classList.remove("show");
      node = node.nextElementSibling || node.nextSibling;
    }

    parent.classList.toggle("show");
  };

  return (
    <React.Fragment>
      <div className="nav-group show">{populateMenu(dashboardMenu)}</div>
    </React.Fragment>
  );
};

export default Sidebar;
