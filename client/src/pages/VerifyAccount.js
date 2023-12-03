import React, { useState } from "react";
import { Button, Card, Container, Form, Nav, Alert } from "react-bootstrap"; // Import Alert from react-bootstrap
import { Link, useNavigate } from "react-router-dom";
import pageSvg from "../assets/svg/mailbox.svg";
import axios from "axios";
import config from "../config.json";

export default function OTPValidation() {
  const url = config.URL;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (otp.length !== 6) {
        setError("Invalid OTP. Please enter a 6-digit OTP.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await axios.post(`${url}/api/login/verify-otp`, {
        email: localStorage.getItem("userEmail"),
        otp,
        newPassword: password,
        confirmPassword,
      });

      if (response.status === 200) {
        // Password reset successful
        setSuccessMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="page-auth">
      <div className="header">
        <Container>
          <Link to="/" className="header-logo">
            T-Works
          </Link>
          <Nav className="nav-icon">
            <Nav.Link href="">
              <i className="ri-twitter-fill"></i>
            </Nav.Link>
            <Nav.Link href="">
              <i className="ri-github-fill"></i>
            </Nav.Link>
            <Nav.Link href="">
              <i className="ri-dribbble-line"></i>
            </Nav.Link>
          </Nav>
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
              <Card.Title>OTP Validation</Card.Title>
              <Card.Text className="mb-5">
                Please enter the 6-digit OTP sent to your email and set a new
                password.
              </Card.Text>

              <Form>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && (
                  <Alert variant="success">{successMessage}</Alert>
                )}
                <Form.Group controlId="otp">
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    required
                  />
                </Form.Group>
                <br></br>
                <Form.Group controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                <br></br>

                <Form.Group controlId="confirmPassword">
                  <Form.Control
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                </Form.Group>
                <br></br>

                <Button variant="primary" type="button" onClick={handleSubmit}>
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}
