import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
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
  Dropdown,
  Nav,
} from "react-bootstrap";
import { Edit, Paperclip, Trash2 } from "react-feather";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import Context from "../Root/Context";
import dummyImage from "../assets/users/user.png";
import AdminProjectHeader from "../layouts/AdminProjectHeader";
import PerfectScrollbar from "react-perfect-scrollbar";
import Avatar from "../components/Avatar";
import DOMPurify from "dompurify";

// import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

import img6 from "../assets/img/img6.jpg";
import img7 from "../assets/img/img7.jpg";
import img8 from "../assets/img/img8.jpg";
import img10 from "../assets/img/img10.jpg";
import img11 from "../assets/img/img11.jpg";
import img12 from "../assets/img/img12.jpg";
import img14 from "../assets/img/img14.jpg";
import img15 from "../assets/img/img15.jpg";
import img16 from "../assets/img/img16.jpg";
import img17 from "../assets/img/img17.jpg";
import img19 from "../assets/img/img19.jpg";


import { leadsData } from "../data/Leads";

import "./Com.css"; // Update this to your CSS file name

// Rest of your code here

let leadId;

function AdminComment({ projectData }) {
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
  const [userImage, setUserImage] = useState(dummyImage);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedImage = localStorage.getItem("userImage");

    if (savedUser && savedImage) {
      setUser(JSON.parse(savedUser));
      setUserImage(savedImage);
    } else {
      const foundUser = leadsData.find((lead) => lead.email === userEmail);
      if (foundUser) {
        setUser(foundUser);
        setUserImage(foundUser.path);
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("userImage", foundUser.path);
      }
    }
  }, [userEmail]);

  /////////////////CHAT//////////////////////////

  useEffect(() => {
    document.body.classList.add("page-app");
    return () => {
      document.body.classList.remove("page-app");
    };
  }, []);

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      to=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="header-link"
    >
      {children}
    </Link>
  ));

  const chatGroup = [
    {
      unread: true,
      avatar: {
        status: "offline",
        img: img11,
      },
      sender: "Dyanne Aceron",
      time: "10:35am",
      text: "Hi Hello! My name is Dyanne Aceron. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    },
    {
      selected: true,
      avatar: {
        status: "online",
        img: img14,
      },
      sender: "Leo Mendez",
      time: "1d",
      text: "There are many variations of pass. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia",
    },
    {
      unread: true,
      avatar: {
        status: "online",
        img: img15,
      },
      sender: "Meriam Salomon",
      time: "2d",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      avatar: {
        status: "online",
        img: img17,
      },
      sender: "Rolando Paloso",
      time: "2d",
      text: "There are many variations of paserror sit voluptatem accusantium doloremque laudantium, totam rem aperiam",
    },
    {
      avatar: {
        status: "offline",
        img: img19,
      },
      sender: "Marianne Audrey",
      time: "5d",
      text: "Hi Hello! There are many variations ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit",
    },
    {
      avatar: {
        status: "offline",
        img: img6,
      },
      sender: "Adrian Moniño",
      time: "1w",
      text: "Lorem ipsum is simply dummy text sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt",
    },
    {
      unread: true,
      avatar: {
        status: "offline",
        img: img7,
      },
      sender: "Andrew Ylaya",
      time: "1w",
      text: "It is a long established fact that aquis autem vel eum iure reprehenderit qui in ea voluptate velit esse",
    },
    {
      avatar: {
        status: "online",
        img: img8,
      },
      sender: "Maricel Villalon",
      time: "2w",
      text: "Hello!, I will be distracted by the requam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur",
    },
    {
      avatar: {
        status: "online",
        img: img10,
      },
      sender: "Warren Vito",
      time: "3w",
      text: "There are many variations of passc up iditate non provident, similique sunt in culpa",
    },
    {
      unread: true,
      avatar: {
        status: "offline",
        img: img11,
      },
      sender: "Lovely Ceballos",
      time: "6w",
      text: "Hello!, I will be distracted by the replaceat facere possimus, omnis voluptas assumenda",
    },
  ];

  const messageGroup = [
    {
      date: "August 20, 2023",
      items: [
        {
          avatar: {
            status: "online",
            img: img16,
          },
          messages: [
            {
              text: "Excepteur sint occaecat cupidatat non proident",
              time: "8:45pm",
            },
            {
              text: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
              time: "9:15pm",
            },
          ],
        },
        {
          reverse: true,
          messages: [
            {
              text: "Neque porro quisquam est, qui dolorem ipsum",
              time: "9:20pm",
            },
            {
              text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accus",
              time: "9:21pm",
            },
          ],
        },
      ],
    },
    {
      date: "Today",
      items: [
        {
          avatar: {
            status: "online",
            img: img16,
          },
          messages: [
            {
              text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              time: "10:30am",
            },
          ],
        },
        {
          reverse: true,
          messages: [
            {
              text: "Accusantium doloremque laudantium",
              time: "10:40am",
            },
            {
              text: "Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo...",
              time: "10:41am",
            },
          ],
        },
        {
          avatar: {
            status: "online",
            img: img16,
          },
          messages: [
            {
              text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit...",
              time: "10:45am",
            },
            {
              text: "Nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
              time: "10:47am",
            },
          ],
        },
      ],
    },
  ];

  const [chatActive, setChatActive] = useState(1);
  const [msgShow, setMsgShow] = useState(false);

  // Toggle chat option in each item
  const navToggle = (e) => {
    e.target.closest(".row").classList.toggle("nav-show");
  };
  ////////////////////////////////////////////////////////

  const selectedProject =
    location.state?.selectedProject ||
    projectData?.find((project) => String(project.id) === String(id));

  const lead = selectedProject && selectedProject.lead;
  const owner = selectedProject && selectedProject.owner;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log(id);

        const response = await axios.get(
          `http://localhost:5000/api/comments/getallcomments/${id}`
        );

        const getUserID = await axios.get(
          `http://localhost:5000/api/users/getall`
        );

        const usersArray = getUserID.data;

        console.log(usersArray);

        const foundUser = usersArray.find((user) => user.firstName === lead);

        console.log(foundUser);

        if (foundUser) {
          leadId = foundUser.id;
          console.log(`User ID for email ${userEmail}: ${leadId}`);
        } else {
          console.log(`User with email ${userEmail} not found.`);
        }

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
        console.log("Comment updated successfully");
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
        console.log("Comment deleted successfully");
        closeDeleteModal();
      } else {
        console.error("Failed to delete comment");
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
      <AdminProjectHeader />
      <div className="main main-app p-3 p-lg-4">
        <div className={"chat-panel" + (msgShow ? " msg-show" : "")}>
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h6 className="sidebar-title me-auto">Chat Messages</h6>

              <Dropdown align="end">
                <Dropdown.Toggle as={CustomToggle}>
                  <i className="ri-more-2-fill"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="">
                    <i className="ri-user-add-line"></i> Invite People
                  </Dropdown.Item>
                  <Dropdown.Item href="">
                    <i className="ri-question-answer-line"></i> Create Channel
                  </Dropdown.Item>
                  <Dropdown.Item href="">
                    <i className="ri-server-line"></i> Server Settings
                  </Dropdown.Item>
                  <Dropdown.Item href="">
                    <i className="ri-bell-line"></i> Notification Settings
                  </Dropdown.Item>
                  <Dropdown.Item href="">
                    <i className="ri-lock-2-line"></i> Privacy Settings
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Link className="header-link ms-1" title="New message">
                <i className="ri-chat-new-line"></i>
              </Link>
            </div>

            <PerfectScrollbar className="sidebar-body">
              <label className="sidebar-label mb-3">Recently Contacted</label>
              <div className="chat-contacts mb-4">
                <Row className="g-2 row-cols-auto">
                  <Col>
                    <Avatar img={img10} status="offline" />
                  </Col>
                  <Col>
                    <Avatar img={img11} status="online" />
                  </Col>
                  <Col>
                    <Avatar img={img12} status="online" />
                  </Col>
                  <Col>
                    <Avatar img={img14} status="online" />
                  </Col>
                  <Col>
                    <Avatar img={img15} status="offline" />
                  </Col>
                  <Col>
                    <Avatar img={img6} status="online" />
                  </Col>
                </Row>
              </div>

              <label className="sidebar-label mb-2">Channels</label>

              <div className="chat-group mb-4">
                {[
                  {
                    name: "General",
                    desc: "Includes <strong>You</strong>, <strong>Dyanne</strong> and <strong>5 others</strong>",
                  },
                  {
                    name: "Technology",
                    desc: "Includes <strong>You</strong>, <strong>Nathan</strong> and <strong>1 other</strong>",
                  },
                  {
                    name: "Production",
                    desc: "Includes all <strong>Engineering</strong> teams",
                  },
                ].map((channel, index) => (
                  <div className="chat-item" key={index}>
                    <div className="avatar">
                      <span className="avatar-initial">#</span>
                    </div>
                    <div className="chat-item-body">
                      <h6>{channel.name}</h6>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(channel.desc),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <label className="sidebar-label mb-2">Direct Messages</label>

              <div className="chat-group">
                {chatGroup.map((chats, index) => (
                  <div
                    key={index}
                    className={
                      "chat-item" +
                      (chats.unread ? " unread" : "") +
                      (chatActive === index ? " selected" : "")
                    }
                    onClick={(e) => {
                      setChatActive(index);
                      setMsgShow(true);
                    }}
                  >
                    <Avatar
                      status={chats.avatar.status}
                      img={chats.avatar.img}
                    />
                    <div className="chat-item-body">
                      <div className="d-flex align-items-center mb-1">
                        <h6 className="mb-0">{chats.sender}</h6>
                        <small className="ms-auto">{chats.time}</small>
                      </div>
                      <span>{chats.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PerfectScrollbar>
          </div>
          <div className="chat-body">
            <div className="chat-body-header">
              <div className="chat-item">
                <Avatar img={img14} status="online" />
                <div className="chat-item-body">
                  <h6 className="mb-1">Leo Mendez</h6>
                  <span>Active now</span>
                </div>
              </div>
              <Nav className="nav-icon ms-auto">
                <Nav.Link href="" title="Invite People">
                  <i className="ri-user-add-line"></i>
                </Nav.Link>
                <Nav.Link href="" title="Member List">
                  <i className="ri-group-line"></i>
                </Nav.Link>
                {/* <Nav.Link href="" title="Call">
                  <i className="ri-phone-line"></i>
                </Nav.Link>
                <Nav.Link href="" title="Video Call">
                  <i className="ri-vidicon-line"></i>
                </Nav.Link> */}
                <Nav.Link href="" title="More Info">
                  <i className="ri-information-line"></i>
                </Nav.Link>
                <Nav.Link
                  href=""
                  className="d-md-none"
                  onClick={() => setMsgShow(false)}
                >
                  <i className="ri-close-fill"></i>
                </Nav.Link>
              </Nav>
            </div>
            <PerfectScrollbar className="chat-body-content">
              {messageGroup.map((msgroup, index) => (
                <React.Fragment key={index}>
                  <div className="divider">
                    <span>{msgroup.date}</span>
                  </div>
                  {msgroup.items.map((item, ind) => (
                    <div
                      key={ind}
                      className={"msg-item" + (item.reverse ? " reverse" : "")}
                    >
                      {item.avatar && (
                        <Avatar
                          status={item.avatar.status}
                          img={item.avatar.img}
                        />
                      )}
                      <div className="msg-body">
                        {item.messages.map((message, i) => (
                          <Row key={i} className="gx-3 row-cols-auto">
                            <Col>
                              <div
                                className="msg-bubble"
                                onMouseOver={navToggle}
                                onMouseLeave={navToggle}
                              >
                                {message.text}
                                <span>{message.time}</span>
                              </div>
                            </Col>
                            <Col>
                              <Nav className="nav-icon">
                                <Nav.Link href="">
                                  <i className="ri-reply-line"></i>
                                </Nav.Link>
                                <Nav.Link href="">
                                  <i className="ri-more-fill"></i>
                                </Nav.Link>
                              </Nav>
                            </Col>
                          </Row>
                        ))}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </PerfectScrollbar>
            <div className="chat-body-footer">
              <Nav className="nav-icon">
                {/* <Nav.Link href="">
                  <i className="ri-add-line"></i>
                </Nav.Link>
                <Nav.Link href="">
                  <i className="ri-image-line"></i>
                </Nav.Link> */}
                {/* <Nav.Link href="">
                  <i className="ri-gift-line"></i>
                </Nav.Link>
                <Nav.Link href="">
                  <i className="ri-emotion-happy-line"></i>
                </Nav.Link> */}
              </Nav>
              <div className="msg-box">
                <Form.Control type="text" placeholder="Write your message..." />
                <Link href="" className="msg-send">
                  <i className="ri-send-plane-2-line"></i>
                </Link>
              </div>
              <Nav className="nav-icon">
                {/* <Nav.Link href="">
                  <i className="ri-thumb-up-line"></i>
                </Nav.Link> */}
              </Nav>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default AdminComment;

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
