// MobileWarning.js

import React from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./mobile.css"; // Assuming you have separate CSS for this component

const Mobile = () => {
  return (
    <>
      <div className="page-sign d-block py-0">
        <Row className="g-0">
          <Col md="7" lg="5" xl="4" className="col-wrapper">
            <Card className="card-sign">
              <Card.Header>
                <Link to="https://work.tworks.in" className="header-logo mb-5">
                  T-Works
                </Link>
              </Card.Header>
              <br></br>
              <br></br>
              <br></br>

              <Card.Body>
                <div className="mobile-warning">
                  For the Best Experience, please view in a 🌍 browser on a 💻
                  desktop device.
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Mobile;
