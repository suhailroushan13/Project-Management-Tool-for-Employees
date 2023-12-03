/* eslint-disable */
import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import config from "../config.json";

import pageSvg from "../assets/svg/forgot_password.svg";
import axios from "axios";

export default function ForgotPassword() {
  const url = config.URL;
  const [email, setEmail] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Hide the alerts when the user starts typing
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const showAlert = (msg, variant) => {
    setAlertMsg(msg);
    setAlertVariant(variant);
    setShowSuccessAlert(true);
  };

  const handleResetPassword = async () => {
    // Check if the email ends with "@tworks.in"
    if (!email.endsWith("@tworks.in")) {
      showAlert("Only T-Works Users are Allowed", "danger");
      return;
    }

    try {
      localStorage.setItem("userEmail", email);

      const response = await axios.post(`${url}/api/login/forgot-password`, {
        email,
      });

      if (response.status === 200) {
        // Handle success
        showAlert("Password reset email sent successfully", "success");
        // Redirect after 5 seconds
        setTimeout(() => {
          navigate("/verify-otp"); // Redirect to /verify-otp
        }, 2000);
      } else {
        // Handle errors
        showAlert(
          "Failed to send password reset email. Please try again.",
          "danger"
        );
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      showAlert(
        "An error occurred while sending the email. Please try again later.",
        "danger"
      );
    }
  };

  return (
    <div className="page-auth">
      <div className="header">
        <Container>
          <Link to="/" className="header-logo">
            T-Works
          </Link>
        </Container>
      </div>

      <div className="content">
        <Container>
          <Card className="card-auth">
            <Card.Body className="text-center">
              <div className="mb-5">
                <object
                  type="image/svg+xml"
                  data={pageSvg}
                  className="w-50"
                  aria-label="svg image"
                ></object>
              </div>
              <Card.Title>Reset your password</Card.Title>
              <Card.Text className="mb-5">
                Enter your username or email address, and we will send you a
                link to reset your password.
              </Card.Text>

              <Row className="g-2">
                <Col sm="8">
                  <Form.Control
                    type="text"
                    placeholder="Enter email address"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Col>
                <Col sm="4">
                  <Button variant="primary" onClick={handleResetPassword}>
                    Reset
                  </Button>
                </Col>
              </Row>

              {showSuccessAlert && (
                <Alert variant={alertVariant} className="mt-3">
                  {alertMsg}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}
