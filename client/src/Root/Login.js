import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import building from "../assets/img/building.jpeg";
import config from "../config.json";
import Context from "./Context"; // Update the path as needed

const Login = () => {
  const context = useContext(Context);
  const url = config.URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "Admin") {
      navigate("/admin/dashboard");
    } else if (["Lead", "User", "Owner"].includes(role)) {
      navigate("/user/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = { email, password };

    // Check if email ends with 'gmail.com'
    if (!email.endsWith("@tworks.in")) {
      setErrorMessage("Only Company Members Allowed");
      return; // Stop the login process
    }

    try {
      const response = await axios.post(`${url}/api/login`, payload);
      const { role, entity, success, token, user } = response.data;

      if (success) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(entity));

        localStorage.setItem("userData", JSON.stringify(user));

        context.setEmail(email); // Set email in context

        if (role === "Admin") {
          navigate("/admin/dashboard");
        } else if (["Lead", "User", "Owner"].includes(role)) {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid Login Credentials");
    }
  };

  return (
    <div className="page-sign d-block py-0">
      <Row className="g-0">
        <Col md="7" lg="5" xl="4" className="col-wrapper">
          <Card className="card-sign">
            <Card.Header>
              <Link to="https://work.tworks.in" className="header-logo mb-5">
                T-Works
              </Link>
              <Card.Title>Log In</Card.Title>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleLogin}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <div className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        <i
                          className={`fa ${
                            showPassword ? "ri-eye-fill" : "ri-eye-off-fill"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" className="btn-sign">
                  Log In
                </Button>
              </form>
              <br></br>
              <Link
                style={{ textDecoration: "none" }}
                to="/forgot-password"
                className="mb-5"
              >
                Forget Password
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-none d-lg-block">
          <img src={building} className="auth-img" alt="" />
        </Col>
      </Row>
    </div>
  );
};

export default Login;
