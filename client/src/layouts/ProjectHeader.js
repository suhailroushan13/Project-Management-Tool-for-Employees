import React, { useContext, useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import dummyImage from "../assets/leads/user.png";
import UserContext from "../dashboard/UserContext";

import anand from "../assets/leads/anand.png";
import meera from "../assets/leads/meera.jpg";
import firoz from "../assets/leads/firoz.jpg";
import raj from "../assets/leads/raj.png";
import sanjay from "../assets/leads/sanjay.jpg";
import veera from "../assets/leads/veera.png";
import user from "../assets/leads/user.png";

export default function ProjectHeader({ onSkin }) {
  const context = useContext(UserContext);
  const userEmail = context.email;

  const leadsData = [
    {
      id: 1,
      name: "Anand",
      path: anand,
      email: "anand@tworks.in",
      role: "VP Operations",
    },
    {
      id: 2,
      name: "Meera",
      path: meera,
      email: "meera@tworks.in",
      role: "Director Facilities",
    },
    {
      id: 3,
      name: "Firoz",
      path: firoz,
      email: "firoz@tworks.in",
      role: "Admin",
    },
    {
      id: 4,
      name: "Raj",
      path: raj,
      email: "raj@tworks.in",
      role: "Finance Admin",
    },
    {
      id: 5,
      name: "Sanjay",
      path: sanjay,
      email: "sanjay@tworks.in",
      role: "Product Development",
    },
    {
      id: 6,
      name: "Veera",
      path: veera,
      email: "veera@tworks.in",
      role: "Admin",
    },
  ];

  const retrievedUser = leadsData.find((lead) => lead.email === userEmail);
  console.log(retrievedUser);

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

  console.log(userImage);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
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
    localStorage.removeItem("userImage");

    // Redirect to the login page
    window.location.href = "/";
  };

  return (
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
  );
}
