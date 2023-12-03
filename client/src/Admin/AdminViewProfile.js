/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Nav,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Edit, Paperclip, Trash2 } from "react-feather";
import { FiSend } from "react-icons/fi";
import { Link, useLocation, useParams } from "react-router-dom";
import Context from "../Root/Context";
import dummyImage from "../assets/users/user.png";
import config from "../config.json";
import axios from "axios";

import Footer from "../layouts/Footer";
import AdminProjectHeader from "../layouts/AdminProjectHeader";
import formatDate from "../Root/FormatDate";
import "../Root/View.css";
import Table from "react-bootstrap/Table";

import Avatar from "../components/Avatar";
import HeaderMobile from "../layouts/HeaderMobile";

let leadId;

function AdminViewProfile() {
  const location = useLocation();
  const { id } = useParams();
  const url = config.URL;

  const context = useContext(Context);
  const userEmail = context.email;
  const [user, setUser] = useState(null);

  const redirectToCustomPage = () => {
    navigate(`/user/edit/${id}`); // Redirect to your custom page
  };

  useEffect(() => {
    // Fetch user data by ID
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${url}/api/users/get/${id}`);
        setUser(response.data); // Set user data from the API response
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, [id, url]);

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
      <br />
      <br />
      <br />
      <div className="new-admincards">
        <div className="profile-image-container">
          <Card.Img
            variant="top"
            src={user?.profileImage || dummyImage}
            className="new-profile-image rounded-circle"
            alt="User Image"
          />
        </div>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Full Name:</td>
              <td>{user?.fullName || "Employee"}</td>
            </tr>
            <tr>
              <td>Role:</td>
              <td>{user?.role || ""}</td>
            </tr>
            <tr>
              <td>Title:</td>
              <td>
                <span>{user?.title}</span>
              </td>
            </tr>
            <tr>
              <td>Created At:</td>
              <td>{user?.createdAt ? timeAgo(user.createdAt) : "Unknown"}</td>
            </tr>
            <tr>
              <td>Last Login At:</td>
              <td>{user?.lastLogin ? timeAgo(user.lastLogin) : "Unknown"}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>
                {user?.phone ? (
                  <span>{user.phone}</span>
                ) : (
                  <span
                    onClick={redirectToCustomPage}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    Update Number
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      <Footer />
      </div>
    </>
  );
}

export default AdminViewProfile;
