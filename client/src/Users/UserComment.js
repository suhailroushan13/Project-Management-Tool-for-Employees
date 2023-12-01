/* eslint-disable */
import React, { useEffect, useState, useContext } from "react";
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
  Badge,
} from "react-bootstrap";
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

function UserComment({ projectData }) {
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
  const [error, setError] = useState(null); // State to hold error messages

  const context = useContext(Context);
  const userEmail = context.email;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    const foundUser = leadsData.find((lead) => lead.email === userEmail);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
    }
  }, [userEmail]);

  // const selectedProject =
  //   location.state?.selectedProject ||
  //   projectData?.find((project) => String(project.id) === String(id));

  // // console.log("Data", selectedProject);

  // const lead = selectedProject && selectedProject.lead;
  // console.log(lead);

  // const owner = selectedProject && selectedProject.owner;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log(id);

        const response = await axios.get(
          `http://localhost:5000/api/comments/getallcomments/${id}`
        );

        // const getUserID = await axios.get(
        //   `http://localhost:5000/api/users/getall`
        // );

        // const usersArray = getUserID.data;

        // console.log(usersArray);

        if (response.status === 200) {
          setComments(response.data.commentsWithUsersAndProjects || []);
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

  const fetchUpdatedComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/getall/${id}`
      );

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
      projectId: id, // Correct the variable name to "projectId" if it's supposed to be project ID
      userId: leadId, // Correct the variable name to "userId" if it's supposed to be user ID
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
        fetchUpdatedComments();
        setNewMessage("");
      } else {
        console.error("Failed to send message to API");
      }
    } catch (error) {
      console.error("Axios error:", error.response.data.error);
    }
  };

  // const handleEditSubmit = async () => {
  //   if (editedCommentText.trim() === "") {
  //     setShowEmptyFieldAlert(true);
  //     return;
  //   }

  //   try {
  //     const response = await axios.put(
  //       `http://192.168.212.10:5000/api/comments/update/${commentToEdit.id}`,
  //       {
  //         text: editedCommentText,
  //         id, // This is your project ID. Adjust if needed.
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("Comment updated successfully");
  //       fetchUpdatedComments();
  //       closeEditModal();
  //     }
  //   } catch (error) {
  //     console.error("Error updating comment:", error);
  //   }
  // };

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
      ); //

      if (response.status === 200) {
        fetchUpdatedComments();
        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setError("Error updating comment"); // Set error state
    }
  };
  const handleDeleteSubmit = async () => {
    try {
      deleteCommentOptimistically(commentToDelete.id);

      const response = await axios.delete(
        `http://localhost:5000/api/comments/delete/${commentToDelete.id}`
      );

      if (response.status === 200) {
        closeDeleteModal();
      } else {
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
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

  const openEditModal = (comment) => {
    setCommentToEdit(comment);
    setEditedCommentText(comment.text);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setCommentToEdit(null);
    setShowEditModal(false);
    setEditedCommentText("");
  };

  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setCommentToDelete(null);
    setShowDeleteModal(false);
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
      <UserProjectHeader />
      <div className="container mt-4">
        <Row>
          <Col className="two" md={12}>
            <Card className="parent-card">
              <Card.Header className="card-header bg-primary text-white">
                <h4>Comments</h4>
              </Card.Header>
              <div className="comment-container-wrapper">
                {isLoading ? (
                  <p className="loading">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="loading">
                    No comments available for this project.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="comment-card">
                      <div className="comment-container">
                        <div className="comment-content">
                          <div className="avatar-container">
                            <img
                              alt={user ? user.name : "Default User"}
                              className="avatar-image"
                            />
                          </div>
                        </div>
                        <p className="comment-text">
                          {comment.text}
                          <br></br>
                          <span className="comment-timestamp">
                            {formatDate(comment.createdAt)}
                          </span>
                        </p>
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
                      </div>
                    </Card>
                  ))
                )}
              </div>

              <Card className="new-comment-card mt-4">
                <Form>
                  <Form.Group className="d-flex align-items-center message-input-group">
                    {/* <span className="attachment-icon mr-2">
                      <Paperclip size={20} />
                    </span> */}
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Add a comment..."
                      className="message-input mr-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevents a new line in the textarea
                          handleSendMessage(); // Call your send message function
                        }
                      }}
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
                <Form.Label>Edit Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="commentText"
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                />
              </Form.Group>
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
        <Modal.Body>Are you sure you want to delete this Comment?</Modal.Body>
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

export default UserComment;

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
