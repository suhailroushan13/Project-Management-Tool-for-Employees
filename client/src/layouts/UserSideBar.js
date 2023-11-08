/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link, NavLink } from "react-router-dom";
import Context from "../Root/Context";
import { UserDashboardMenu } from "../data/UserMenu";
import { leadsData } from "../data/Leads";
import dummyImage from "../assets/users/user.png";
import axios from "axios";

const UserSidebar = () => {
  const context = useContext(Context);
  const userEmail = context.email;

  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(dummyImage);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedImage = localStorage.getItem("userImage");

    if (savedUser && savedImage) {
      setUser(JSON.parse(savedUser));
      setUserImage(savedImage);
    } else {
      const foundUser = leadsData.find((lead) => lead.email === userEmail);
      let findUser = JSON.parse(savedUser);
      if (foundUser) {
        setUser(foundUser);
        setUserImage(foundUser.path);
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("userImage", foundUser.path);
      } else {
        setUser(findUser.fullName);
        setUserImage(dummyImage);
      }
    }
  }, [userEmail]);

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
            <img src={userImage} alt={user ? user.name : "Default User"} />
          </div>
          <div className="sidebar-footer-body">
            <h6>{user ? user.name : ""}</h6>
            <p>{user ? user.role : ""}</p>
          </div>
          <Link onClick={toggleFooterMenu} to="" className="dropdown-link">
            <i className="ri-arrow-down-s-line"></i>
          </Link>
        </div>
        <div className="sidebar-footer-menu">
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
      <div className="nav-group show">{populateMenu(UserDashboardMenu)}</div>
    </React.Fragment>
  );
};

export default UserSidebar;
