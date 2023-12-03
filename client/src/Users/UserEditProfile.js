/* eslint-disable */
import React, { useContext, useEffect, useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import dummyImage from "../assets/users/user.png";
import { useLocation, useParams } from "react-router-dom";
import Context from "../Root/Context";
import config from "../config.json";
import Footer from "../layouts/Footer";

import UserProjectHeader from "../layouts/UserProjectHeader";
import HeaderMobile from "../layouts/HeaderMobile";
function UserEditProfile() {
  const location = useLocation();
  const { id } = useParams();

  const context = useContext(Context);
  const userEmail = context.email;
  const url = config.URL;
  const [allUserImages, setAllUserImages] = useState([]);

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    // Fetch all user images
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${url}/api/users/getallimages`);
        if (response.data.success) {
          setAllUserImages(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching images", error);
      }
    };

    fetchImages();
  }, []);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    title: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Set user profile image based on user ID
    if (allUserImages.length > 0 && user) {
      const userImage = allUserImages.find((u) => u.id === parseInt(user.id));
      if (userImage) {
        setImagePreviewUrl(userImage.profileImage);
      }
    }
  }, [allUserImages, user]);

  // eslint-disable-next-line
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type); // 'success' or 'danger'

    // Hide the alert after 5 seconds
    const id = setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);

    setTimeoutId(id); // Store the timeout ID for possible cleanup
  };
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(
      localStorage.getItem("userData")
    );
    if (userDataFromLocalStorage) {
      setUserData({
        ...userDataFromLocalStorage,
        password: "", // Set the password field to be initially blank
      });
    }
  }, []);
  // Click the hidden file input to trigger

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete(`${url}/api/users/deleteimage/${id}`);
      console.log(response.data);
      showAlert("Image deleted successfully.", "success");

      // Reload the page after deleting the image
      window.location.reload();
    } catch (error) {
      console.error("Error deleting image", error.response.data);
      showAlert("Error deleting image.", "danger");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if all values in userData are empty
    const isAllEmpty = Object.values(userData).every((value) => value === "");
    if (isAllEmpty) {
      setAlertMessage(
        "No updates to save. Please make changes before submitting."
      );

      setAlertType("warning");
      setIsLoading(false);
      return; // Early return if no changes
    }

    const updatedFields = {};
    for (const key in userData) {
      if (userData[key] !== "") {
        updatedFields[key] = userData[key];
      }
    }

    try {
      const response = await axios.put(
        `${url}/api/users/update/${id}`,
        updatedFields
      );
      setAlertMessage("User Updated successfully... Logging out in 3 seconds.");
      setAlertType("success");

      // Countdown before logout
      let countdown = 3;
      const intervalId = setInterval(() => {
        if (countdown === 0) {
          clearInterval(intervalId);
          localStorage.clear();
          window.location.href = "/";
        } else {
          setAlertMessage(
            `User Updated successfully... Logging out in ${countdown} seconds.`
          );
          countdown--;
        }
      }, 1000);
    } catch (error) {
      console.error("Error updating user data", error);
      setAlertMessage("Error updating user data");
      setAlertType("danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files && fileInput.files[0];

    // Check if a file is selected
    if (!file) {
      fileInput.click();
      return;
    }

    // Check file type
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
      showAlert("Please select a JPEG, JPG, or PNG image file.", "danger");
      resetFileInput();
      return;
    }

    // Check file size
    const fileSizeMB = file.size / 1024 / 1024; // size in MB
    if (fileSizeMB > 5) {
      showAlert("File size should be less than 5MB.", "danger");
      resetFileInput();
      return;
    }

    // Create FormData and append file
    const formData = new FormData();
    formData.append("image", file);

    // API call to upload the image
    try {
      await axios.post(`${url}/api/users/uploadimage/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      window.location.reload();
      showAlert("Image uploaded successfully.", "success");
      setSelectedImage(file);

      setImagePreviewUrl(URL.createObjectURL(file)); // Update the preview without reloading
    } catch (error) {
      console.error("Error uploading image", error.response.data);
      showAlert("Error uploading image.", "danger");
    }

    // Function to reset the file input
    function resetFileInput() {
      fileInput.value = "";
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for a smooth scrolling
    });
  };

  return (
    <>
      <UserProjectHeader />
      <HeaderMobile />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Form onSubmit={handleSubmit} className="admin-edit-profile-form">
              <br></br>
              <br></br>
              <br></br>

              <div style={{ textAlign: "center", padding: "10px" }}>
                {alertMessage && (
                  <Alert variant={alertType}>{alertMessage}</Alert>
                )}
              </div>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <img
                  src={user?.profileImage || dummyImage} // Replace with your default image path
                  style={{
                    maxWidth: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    width: "150px",
                    height: "150px",
                  }}
                />
              </div>
              <Form.Group>
                <Form.Label style={{ marginLeft: "20px" }}>
                  Edit Image
                </Form.Label>
                <div
                  style={{ marginRight: "100px" }}
                  className="d-flex align-items-center"
                >
                  <div className="col">
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImageChange}
                      ref={fileInputRef} // Attach the ref to the input element
                    />
                  </div>
                  <div className="col-auto">
                    <Button variant="danger" onClick={handleDeleteImage}>
                      Delete Image
                    </Button>
                  </div>
                </div>
              </Form.Group>

              <Form.Group>
                <br></br>
              </Form.Group>

              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <br></br>

              <Form.Group>
                <Form.Label>Display Name</Form.Label>
                <Form.Control
                  type="text"
                  name="displayName"
                  value={userData.displayName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="+919618211XXX"
                  value={userData.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Update Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    autoComplete={
                      showPassword ? "new-password" : "current-password"
                    }
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
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
              </Form.Group>
              <br></br>

              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  as="input"
                  name="title"
                  placeholder="Engineer, Senior, Manager, Fellow, Designer, Intern"
                  value={userData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="input"
                  name="role"
                  placeholder="Lead, Owner, User"
                  value={userData.role}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <br></br>

              <Button variant="primary" type="submit" onClick={scrollToTop}>
                Update
              </Button>
        <Footer />
            </Form>
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .admin-edit-profile-form {
          padding: 20px;
          margin-top: 120px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .admin-edit-profile-form {
            margin: 20px;
            padding: 15px;
          }
        }
      `}</style>
    </>
  );
}
export default UserEditProfile;
