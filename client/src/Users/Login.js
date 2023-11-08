// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import building from "../assets/img/building.jpeg";
// import config from "../config.json";
// import Context from "../Root/Context"; // Update the path as needed

// const Login = () => {
//   const context = useContext(Context);
//   let url = config.URL;
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigateToAppropriateRoute(); // Check and redirect based on user role
//     }
//   }, [navigate]);

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const navigateToAppropriateRoute = (role) => {
//     if (role === "User" || role === "Lead") {
//       navigate("/user"); // Redirect to the user route
//     } else if (role === "Admin") {
//       navigate("/admindashboard"); // Redirect to the admin route
//     } else {
//       // Handle other roles or scenarios as needed
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const payload = { email, password };

//     try {
//       const response = await axios.post(`${url}/api/login`, payload);
//       console.log(response.data.role);

//       let role = response.data.role;

//       if (response.status === 200 && response.data.success) {
//         const { token } = response.data;
//         localStorage.setItem("token", token);
//         localStorage.setItem("role", role);
//         context.setEmail(email); // Set email in context

//         if (role === "User" || role === "Lead") {
//           navigate("/user"); // Redirect to the user route
//         } else if (role === "Admin") {
//           navigate("/admindashboard"); // Redirect to the admin route
//         } else {
//           // Handle other entitys or scenarios as needed
//         }

//         // Call navigateToAppropriateRoute with the user's role
//         // console.log(response.data.entity.role);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setErrorMessage(`${error.response.data.message}`);
//     }
//   };

//   return (
//     <div className="page-sign d-block py-0">
//       <Row className="g-0">
//         <Col md="7" lg="5" xl="4" className="col-wrapper">
//           <Card className="card-sign">
//             <Card.Header>
//               <Link to="/" className="header-logo mb-5">
//                 T-Works
//               </Link>
//               <Card.Title>Log In</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <form onSubmit={handleLogin}>
//                 {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//                 <div className="mb-3">
//                   <Form.Label>Email address</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter your email address"
//                     value={email}
//                     onChange={handleEmailChange}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={handlePasswordChange}
//                   />
//                 </div>
//                 <Button type="submit" variant="primary" className="btn-sign">
//                   Log In
//                 </Button>
//               </form>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col className="d-none d-lg-block">
//           <img src={building} className="auth-img" alt="" />
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Login;
