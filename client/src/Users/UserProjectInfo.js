/* eslint-disable */
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Row, Col, Card, Alert, Badge } from "react-bootstrap";
import { Edit, Paperclip, Trash2 } from "react-feather";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import Context from "../Root/Context";
import dummyImage from "../assets/users/user.png";
import { leadsData } from "../data/Leads";

import UserProjectHeader from "../layouts/UserProjectHeader";
import Footer from "../layouts/Footer";
import "./Com.css"; // Update this to your CSS file name

let leadId;

function UserProjectInfo({ projectData }) {
  const location = useLocation();
  const { id } = useParams();

  const context = useContext(Context);
  const userEmail = context.email;

  const selectedProject =
    location.state?.selectedProject ||
    projectData?.find((project) => String(project.id) === String(id));

  console.log(selectedProject);

  const lead = selectedProject && selectedProject.lead;
  const owner = selectedProject && selectedProject.owner;

  const displayProperties = {
    projectName: "Project Name",
    description: "Description",
    lead: "Lead",
    owner: "Owner",
    newEndDate: "Due Date",
    priority: "Priority",
    status: "Status",
    nextReview: "Next Review",
    createdAt: "Project Created On",
    updatedAt: "Project Last Update ",
  };

  const badgeClassesForPriority = {
    NA: "primary",
    LOW: "secondary",
    HIGH: "danger",
    MEDIUM: "warning",
  };

  const badgeClassesForStatus = {
    COMPLETED: "success",
    "ON HOLD": "warning",
    "IN PROGRESS": "primary",
    "NOT STARTED": "danger",
    OVERDUE: "danger",
  };

  return (
    <>
      <br></br>
      <br></br>
      <UserProjectHeader />
      <div className="container mt-4">
        <Col className="one" md={12}>
          {selectedProject ? (
            <Card className="mt-4">
              <Card.Header className="card-header bg-primary text-white">
                <h4>Project Details</h4>
              </Card.Header>
              <Card.Body>
                {/* {Object.entries(displayProperties).map(
                  ([key, displayName], index) => (
                    <Row key={key} className="mb-2">
                      <Col md={4}>
                        <strong>{displayName}:</strong>
                      </Col>
                      <Col md={8}>
                        {index === 5 ? ( // Check if it's the 4th value
                          <Badge
                            bg={badgeClassesForPriority[selectedProject[key]]}
                            pill
                          >
                            {selectedProject[key]}
                          </Badge>
                        ) : index === 6 ? ( // Check if it's the 5th value
                          <Badge
                            bg={badgeClassesForStatus[selectedProject[key]]}
                          >
                            {selectedProject[key]}
                          </Badge>
                        ) : (
                          selectedProject[key]
                        )}
                      </Col>
                    </Row>
                  )
                )} */}
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.projectName}:</strong>
                  </Col>
                  <Col md={8}>{selectedProject.projectName}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.description}:</strong>
                  </Col>
                  <Col md={8}>{selectedProject.description}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.lead}:</strong>
                  </Col>
                  <Col md={8}>{selectedProject.lead}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.owner}:</strong>
                  </Col>
                  <Col md={8}>{selectedProject.owner}</Col>
                </Row>

                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.priority}:</strong>
                  </Col>
                  <Col md={8}>
                    <Badge
                      bg={badgeClassesForPriority[selectedProject.priority]}
                      pill
                    >
                      {selectedProject.priority}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.status}:</strong>
                  </Col>
                  <Col md={8}>
                    <Badge bg={badgeClassesForStatus[selectedProject.status]}>
                      {selectedProject.status}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.newEndDate}:</strong>
                  </Col>
                  <Col md={8}>{selectedProject.newEndDate}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.nextReview}:</strong>
                  </Col>
                  <Col md={8}>
                    {selectedProject.nextReview
                      ? selectedProject.nextReview
                      : "-"}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.createdAt}:</strong>
                  </Col>
                  <Col md={8}>
                    {formatDate(
                      selectedProject.createdAt
                        ? selectedProject.createdAt
                        : "-"
                    )}
                    {" By " + (lead || "")}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>{displayProperties.updatedAt}:</strong>
                  </Col>
                  <Col md={8}>
                    {formatDate(
                      selectedProject.updatedAt
                        ? selectedProject.updatedAt
                        : "-"
                    )}
                    {" By " + (lead || "")}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="danger" className="mt-4">
              Error: Project details not available.
            </Alert>
          )}
        </Col>
        <Footer />
      </div>
    </>
  );
}

export default UserProjectInfo;

function formatDate(dateTimeString) {
  if (!dateTimeString) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleString("en-IN", options);
}
