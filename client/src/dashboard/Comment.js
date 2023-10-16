/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Row, Col, Card, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";

import ProjectHeader from "../layouts/ProjectHeader";
import Footer from "../layouts/Footer";
import "./Comment.css";

function Comment({ projectData }) {
  const location = useLocation();
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [projectId, setProjectId] = useState(""); // Initialize with the project ID

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://192.168.212.10:5000/api/comments/get/${id}`
        );

        if (response.status === 200) {
          setComments(response.data.comments); // Use response.data.comments instead of response.data.comments.text
        } else {
          console.error("Failed to fetch comments from API");
        }
      } catch (error) {
        console.error("Axios error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }

    const message = {
      text: newMessage,
      id: id,
    };

    try {
      const response = await axios.post(
        "http://192.168.212.10:5000/api/comments/add",
        message,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setComments([...comments, message]);
        console.log(comments);

        setNewMessage("");
      } else {
        console.error("Failed to send message to API");
      }
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const displayProperties = {
    projectName: "Project Name",
    description: "Description",
    lead: "Lead",
    owner: "Owner",
    newEndDate: "Due Date",
    priority: "Priority",
    status: "Status",
    nextReview: "Next Review",
  };

  const selectedProject =
    location.state?.selectedProject ||
    projectData?.find((project) => String(project.id) === String(id));

  return (
    <>
      <ProjectHeader />
      <div className="container mt-4">
        <Row>
          <Col md={6}>
            <h3>Project Details</h3>
            {selectedProject ? (
              <Card className="mt-4">
                <Card.Header className="card-header bg-primary text-white">
                  Project Details
                </Card.Header>
                <Card.Body>
                  {Object.entries(displayProperties).map(([key, displayName]) =>
                    selectedProject[key] ? (
                      <Row key={key} className="mb-2">
                        <Col md={4}>
                          <strong>{displayName}:</strong>
                        </Col>
                        <Col md={8}>{selectedProject[key]}</Col>
                      </Row>
                    ) : null
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="danger" className="mt-4">
                Error: Project details not available.
              </Alert>
            )}
          </Col>
        </Row>
        <Footer />
      </div>
    </>
  );
}

export default Comment;
