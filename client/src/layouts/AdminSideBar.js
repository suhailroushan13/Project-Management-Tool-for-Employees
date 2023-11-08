import React, { useContext, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link, NavLink } from "react-router-dom";
import Context from "../Root/Context";
import { AdminDashboardMenu } from "../data/AdminMenu";
import { leadsData } from "../data/Leads";
import admin from "../assets/users/admin.png";

const AdminSidebar = () => {
  const context = useContext(Context);
  const userEmail = context.email;

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
            <img src={admin} alt={admin ? admin : "Default User"} />
          </div>
          <div className="sidebar-footer-body">
            <h6>{"Admin"}</h6>
            <p>{"Administrator"}</p>
          </div>
          <Link onClick={toggleFooterMenu} to="" className="dropdown-link">
            <i className="ri-arrow-down-s-line"></i>
          </Link>
        </div>
        <div className="sidebar-footer-menu">
          <nav className="nav">
            <Link to="/admin/view">
              <i className="ri-profile-line"></i> View Profile
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
      <div className="nav-group show">{populateMenu(AdminDashboardMenu)}</div>
    </React.Fragment>
  );
};

export default AdminSidebar;
