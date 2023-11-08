/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Edit, Paperclip, Trash2 } from "react-feather";
import { FiSend } from "react-icons/fi";
import { Link, useLocation, useParams } from "react-router-dom";
import Context from "../Root/Context";
import dummyImage from "../assets/users/user.png";
import admin from "../assets/users/admin.png";
import { leadsData } from "../data/Leads";

import Footer from "../layouts/Footer";
import AdminProjectHeader from "../layouts/AdminProjectHeader";
import formatDate from "../Root/FormatDate";
import "../Root/View.css";

import Avatar from "../components/Avatar";
import HeaderMobile from "../layouts/HeaderMobile";

let leadId;

function AdminViewProfile() {
  const location = useLocation();
  const { id } = useParams();

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
      if (foundUser) {
        setUser(foundUser);
        setUserImage(foundUser.path);
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("userImage", foundUser.path);
      }
    }
  }, [userEmail]);

  let userData = localStorage.getItem("userData");
  let stringToObject = JSON.parse(userData);
  const {
    firstName,
    lastName,
    email,
    role,
    phone,
    lastLogin,
    createdAt,
    bio,
    title,
    lastActive,
  } = stringToObject;

  let fullName = firstName + " " + lastName;

  console.log(stringToObject);

  function formatDate(inputDate) {
    const options = {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleDateString("en-IN", options);
    return formattedDate;
  }

  const inputDateString = "2023-10-20T04:32:11.000Z";
  const formattedDate = formatDate(inputDateString);
  console.log(formattedDate); // Output: "22 Aug, 23"

  function timeAgo(pastDate) {
    const differenceInSeconds = Math.floor(
      (new Date() - new Date(pastDate)) / 1000
    );
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if (differenceInSeconds < minute) {
      return `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < hour) {
      return `${Math.floor(differenceInSeconds / minute)} minutes ago`;
    } else if (differenceInSeconds < day) {
      return `${Math.floor(differenceInSeconds / hour)} hours ago`;
    } else if (differenceInSeconds < week) {
      return `${Math.floor(differenceInSeconds / day)} days ago`;
    } else {
      return `${Math.floor(differenceInSeconds / week)} weeks ago`;
    }
  }

  return (
    <>
      <AdminProjectHeader />
      <HeaderMobile />
      <br></br>
      <br></br>
      <br></br>
      <div className="cards">
        <Card className="neumorphic-card card">
          <Card.Body className="profile-card-content">
            <Card.Img
              variant="top"
              src={admin || dummyImage}
              className="profile-image"
              alt="User Image"
            />
            <Card.Title className="profile-name">
              {fullName || "Employee"}
            </Card.Title>
            <Card.Text className="profile-bio">
              <b>Bio: </b> {role || "User"}
            </Card.Text>
            <Card.Text className="profile-created-at">
              <b>Created At : </b>
              {createdAt ? timeAgo(createdAt) : "Unknown"}
            </Card.Text>
            <Card.Text className="profile-last-login">
              <b>Last Login At : </b>
              {lastLogin ? timeAgo(lastLogin) : "Unknown"}
            </Card.Text>
            <Card.Text className="profile-role">
              <b>Role : </b>
              {role || "User"}
            </Card.Text>
            <Card.Header className="section-title">
              Contact Information
            </Card.Header>
            <ul className="contact-info-list">
              <li>
                <i className="ri-mail-fill"></i>
                <span>{email}</span>
              </li>
              <li>
                <i className="ri-phone-fill"></i>
                <span>{phone || "XXXXXXXXXXXXX"}</span>
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
}

export default AdminViewProfile;
