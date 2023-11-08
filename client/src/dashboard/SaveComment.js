/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Alert,
  Form,
  Tooltip,
  Button,
  OverlayTrigger,
  Modal,
  Container,
} from "react-bootstrap";
import { Edit, Paperclip, Trash2 } from "react-feather";
import { FiSend } from "react-icons/fi";
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
  const [editedCommentText, setEditedCommentText] = useState("");
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmptyFieldAlert, setShowEmptyFieldAlert] = useState(false);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/comments/getall/${id}`
        );

        console.log(response.data);

        if (response.status === 200) {
          setComments(response.data || []);
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

  const deleteCommentOptimistically = (commentId) => {
    // Update the UI by removing the deleted comment immediately
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  // Add a function to fetch comments whenever there's an update
  const fetchUpdatedComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/getall/${id}`
      );

      console.log(response.data);

      if (response.status === 200) {
        setComments(response.data || []);
      } else {
        console.error("Failed to fetch comments from API");
      }
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }

    const messageData = {
      text: newMessage,
      id: id,
    };

    try {
      const response = await axios.post(
        "http://192.168.212.10:5000/api/comments/add",
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Immediately update comments after sending a new message
        fetchUpdatedComments();

        setNewMessage("");
      } else {
        console.error("Failed to send message to API");
      }
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const handleEditSubmit = async () => {
    if (editedCommentText.trim() === "") {
      setShowEmptyFieldAlert(true);
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.212.10:5000/api/comments/update/${commentToEdit.id}`,
        {
          text: editedCommentText,
          id, // This is your project ID. Adjust if needed.
        }
      );

      if (response.status === 200) {
        console.log("Comment updated successfully");
        // Immediately update comments after editing
        fetchUpdatedComments();

        // Close the Edit Modal
        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      // Optimistically update the UI before the API request
      deleteCommentOptimistically(commentToDelete.id);

      const response = await axios.delete(
        `http://localhost:5000/api/comments/delete/${commentToDelete.id}`
      );

      if (response.status === 200) {
        console.log("Comment deleted successfully");
        // No need to update the UI again here since it was updated optimistically
        // Close the Delete Modal
        closeDeleteModal();
      } else {
        // If the API request fails, you can revert the UI back to its previous state
        // and show an error message to the user
        console.error("Failed to delete comment");
        // Implement logic to handle the error, e.g., show an error message
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Handle errors here, e.g., show an error message to the user
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

  const openEditModal = (comment) => {
    setCommentToEdit(comment);
    setEditedCommentText(comment.text); // Set the current comment text
    setShowEditModal(true);
  };

  // Function to close the Edit Comment Modal
  const closeEditModal = () => {
    setCommentToEdit(null);
    setShowEditModal(false);
    setEditedCommentText(""); // Clear the edited comment text
  };

  // Function to open the Delete Comment Modal
  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  // Function to close the Delete Comment Modal
  const closeDeleteModal = () => {
    setCommentToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <>
      <ProjectHeader />
      <div className="container mt-4">
        <Row>
          {/* Left side: Project Details */}
          <Col className="one" md={6}>
            {selectedProject ? (
              <Card className="mt-4">
                <Card.Header className="card-header bg-primary text-white">
                  <h4>Project Details</h4>
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

          {/* Right side: Comments */}
          <br></br>

          {/* Delete Modal */}

          <Col className="two" md={6}>
            <Card className="parent-card">
              <Card.Header className="card-header bg-primary text-white">
                <h4>Comments</h4>
              </Card.Header>

              {/* Card for displaying all comments */}
              <Card className="comments-card">
                {isLoading ? (
                  <p>Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p>No comments available for this project.</p>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="comment-card">
                      <p className="comment-text">{comment.text}</p>
                      <small className="comment-timestamp">
                        Created At:{" "}
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                      <div className="comment-actions">
                        <span
                          className="edit-icon"
                          onClick={() => openEditModal(comment)}
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                <strong>Edit</strong>
                              </Tooltip>
                            }
                          >
                            <Edit size={20} color="blue" />
                          </OverlayTrigger>
                        </span>
                        <span
                          className="delete-icon"
                          onClick={() => openDeleteModal(comment)}
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                <strong>Delete</strong>
                              </Tooltip>
                            }
                          >
                            <Trash2 size={20} color="red" />
                          </OverlayTrigger>
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </Card>

              {/* Card for adding a new comment */}
              <Card className="new-comment-card mt-4">
                <Form>
                  <Form.Group className="d-flex align-items-center message-input-group">
                    <span className="attachment-icon mr-2">
                      <Paperclip size={20} />
                    </span>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Add a comment..."
                      className="message-input mr-2"
                    />
                    <Button onClick={handleSendMessage} className="send-button">
                      <FiSend size={15} className="send" />
                    </Button>
                  </Form.Group>
                </Form>
              </Card>
            </Card>
          </Col>
        </Row>
        <Footer />
      </div>

      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>

        {showEmptyFieldAlert && (
          <div className="alert alert-danger">
            Please fill out all required fields.
          </div>
        )}

        <Modal.Body>
          <Container>
            <Form>
              <Form.Group>
                <Form.Label>Comment Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="commentText"
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                />
              </Form.Group>
              {/* Add any other fields relevant to editing a comment */}
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Comment;
