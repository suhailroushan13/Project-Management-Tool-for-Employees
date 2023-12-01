/* eslint-disable */
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Pagination,
  Row,
  Tooltip,
} from "react-bootstrap";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  Trash2,
  Info,
} from "react-feather";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import "../assets/css/react-datepicker.min.css";
import Avatar from "../components/Avatar";
import config from "../config.json";
import UserProjectHeader from "../layouts/UserProjectHeader";
import Footer from "../layouts/Footer";
import dummyImage from "../assets/users/user.png";
import Select from "react-select";
import { useTableContext } from "../Context/TableContext";
import { getLeads, getRest } from "../apps/data/Leadowner";

///////////////////////////////////////////////////////////

const UserAllProjects = () => {
  const url = config.URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const { globalFilter } = useTableContext();

  const [localData, setLocalData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  // Task Data
  const [taskData, setTaskData] = useState({
    projectName: "",
    description: "",
    lead: "",
    owner: "",
    newEndDate: "",
    priority: "MEDIUM",
    status: "NOT STARTED",
    nextReview: "",
    createdBy: null,
  });

  const [leadImage, setLeadImage] = useState("");
  const [ownerImage, setOwnerImage] = useState("");

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData().then((data) => {
      if (data && data.length > 0) {
        // Check if the first project in the array has the necessary data
        const firstProject = data[0];

        if (firstProject.Lead && firstProject.Lead.profileImage) {
          setLeadImage(firstProject.Lead.profileImage); // Set lead image path
        }

        if (firstProject.Owner && firstProject.Owner.profileImage) {
          setOwnerImage(firstProject.Owner.profileImage); // Set owner image path
        }
      }
    });
  }, []);

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

  const [leadSelectOptions, setLeadSelectOptions] = useState([]);
  const [ownerSelectOptions, setOwnerSelectOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const leads = await getLeads();

      const owners = await getRest();

      setLeadSelectOptions(leads);
      setOwnerSelectOptions(owners);
    }

    fetchData();
  }, []);

  // eslint-disable-next-line
  const [description, setDescription] = useState("");
  // eslint-disable-next-line
  const [leadOptions, setLeadOptions] = useState([]);
  // eslint-disable-next-line
  const [ownerOptions, setOwnerOptions] = useState("");
  // eslint-disable-next-line
  const [selectedLead, setSelectedLead] = useState("");
  // eslint-disable-next-line
  const [filterInput, setFilterInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEmptyFieldAlert, setShowEmptyFieldAlert] = useState(false);

  // Function to open the delete confirmation modal
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  // eslint-disable-next-line
  const [selectedOwner, setSelectedOwner] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  // Define and initialize the missing variables
  const dropdownRef = useRef(null);

  const [openFilter, setOpenFilter] = useState(null);
  const multiSelectFilterFn = (rows, id, filterValues) => {
    if (!filterValues.length) {
      return rows;
    }
    return rows.filter((row) => filterValues.includes(row.values[id]));
  };

  // Handle modal open and close for Add
  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    // Clear form fields for Add modal (if necessary)
    setDescription("");
    setSelectedLead("");
    setSelectedOwner("");
  };

  // Handle modal open and close for Edit
  // eslint-disable-next-line
  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    // Clear form fields for Edit modal (if necessary)
    setDescription("");
    setSelectedLead("");
    setSelectedOwner("");
  };

  let userData = localStorage.getItem("userData");
  let stringToObject = JSON.parse(userData);
  let userID = stringToObject.id;
  /////////////////////////// Add Data ///////////////////////////////
  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    if (
      !taskData.projectName ||
      !taskData.lead ||
      !taskData.owner ||
      !taskData.newEndDate ||
      !taskData.priority ||
      !taskData.status
    ) {
      showAlert("Please fill out all required fields.", "danger");
      return;
    }

    try {

      taskData.createdBy = userID;
      await axios.post(`${url}/api/projects/add`, taskData);

      // Clear the taskData object after successful submission
      setTaskData({
        projectName: "",
        lead: "",
        owner: "",
        newEndDate: "",
        priority: "",
        status: "",
      });

      closeAddModal();

      showAlert("Project Added Successfully!", "success");
      fetchData();
    } catch (error) {
      console.error("Error: ", error);
      showAlert(`${error.response.data.message}`, "danger");
    }
  };
  // ////////////////////////// Edit Data /////////////////////////////////////////////////
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (
      !taskData.projectName ||
      !taskData.lead ||
      !taskData.owner ||
      !taskData.newEndDate ||
      !taskData.priority ||
      !taskData.status
    ) {
      showAlert("Please fill out all required fields.", "danger");
      return;
    }

    try {
      await axios.put(`${url}/api/projects/update/${editingItem.id}`, taskData);
      closeEditModal();
      setEditingItem(null);
      setTaskData(taskData);
      showAlert("Project Updated Successfully!", "success");
      fetchData();
    } catch (error) {
      console.error("Error: ", error);
      showAlert(`${error.response.data.message}`, "danger");
    }
  };

  // ///////////////////////Delete Data //////////////////////////

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${url}/api/projects/delete/${itemToDelete.id}`
      );

      if (response.data.success) {
        const updatedData = localData.filter((i) => i !== itemToDelete);
        setLocalData(updatedData);
        setShowDeleteModal(false);
        showAlert("Project Deleted Successfully!", "success");
      } else {
        console.error("Error deleting project:", response.data.message);
        showAlert(`${error.response.data.message}`, "danger");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      showAlert(`${error.response.data.message}`, "danger");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getall`);
      // Sort the array in descending order based on the "id" field
      const sortedData = response.data.sort((a, b) => b.id - a.id);

      setLocalData(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    // Populate the form with the selected item's data for editing
    setTaskData({
      id: item.id,
      projectName: item.projectName,
      description: item.description,
      lead: item.lead,
      owner: item.owner,
      newEndDate: item.newEndDate,
      priority: item.priority,
      status: item.status,
      nextReview: item.nextReview,
    });
    setEditingItem(item);
    setShowEditModal(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Project Name",
        accessor: "projectName",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        width: 100,
      },
      {
        Header: "Description",
        accessor: "description",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => {
          // Check if value is not null or undefined before accessing its length
          if (value) {
            return (
              <div style={{ textAlign: "left" }}>
                {value.length > 30 ? value.substring(0, 50) + "..." : value}
              </div>
            );
          } else {
            // Handle the case where value is null or undefined
            return <div style={{ textAlign: "left" }}>No Description</div>;
          }
        },
      },
      {
        Header: "Lead",
        accessor: "lead",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center gap-2">
            <Avatar
              img={row.original.Lead.profileImage || dummyImage}
              alt="Lead Avatar"
            />
            <span>{row.original.Lead.displayName}</span>
          </div>
        ),
      },
      {
        Header: "Owner",
        accessor: "owner",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center gap-2">
            <Avatar
              img={row.original.Owner.profileImage || dummyImage}
              alt="Owner Avatar"
            />
            <span>{row.original.Owner.displayName}</span>
          </div>
        ),
      },
      {
        Header: "Due Date",
        accessor: "newEndDate",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => (
          <div style={{ textAlign: "center" }}>{formatDate(value)}</div>
        ),
      },
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ value }) => {
          let bgColor, textColor, center, bold;
          switch (value) {
            case "HIGH":
              bgColor = "danger";
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            case "MEDIUM":
              bgColor = "warning";
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            case "LOW":
              bgColor = "info";
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            case "NA":
              bgColor = "success";
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            default:
              bgColor = "white"; // Default background color if none of the above
          }
          if (
            value === "HIGH" ||
            value === "MEDIUM" ||
            value === "LOW" ||
            value === "NA"
          ) {
            return (
              <center>
                <Badge bg={bgColor} size="lg" pill>
                  {value}
                </Badge>
              </center>
            );
          }
          return (
            <div
              style={{
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: bold,
                textAlign: center,
              }}
            >
              {value}
            </div>
          );
        },
        // eslint-disable-next-line
        Filter: DropdownFilter,
        // eslint-disable-next-line
        filter: multiSelectFilterFn,
      },
      {
        Header: "Status",
        accessor: "status",
        filter: multiSelectFilterFn,
        Cell: ({ value }) => {
          let bgColor, textColor, center, bold;

          switch (value) {
            case "NOT STARTED":
              bgColor = "danger"; // Change to "danger" for NOT STARTED
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            case "IN PROGRESS":
              bgColor = "primary"; // Change to "primary" for IN PROGRESS
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            case "ON HOLD":
              bgColor = "warning"; // Change to "warning" for ON HOLD
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            case "COMPLETED":
              bgColor = "success";
              textColor = "white";
              center = "center";
              bold = "bold";
              break;
            default:
              bgColor = "white"; // Default background color if none of the above
          }

          if (
            value === "NOT STARTED" ||
            value === "IN PROGRESS" ||
            value === "ON HOLD" ||
            value === "OVERDUE" ||
            value === "COMPLETED"
          ) {
            return (
              <center>
                <Badge bg={bgColor}>{value}</Badge>
              </center>
            );
          }

          return (
            <div
              style={{
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: bold,
                textAlign: center,
              }}
            >
              {value}
            </div>
          );
        },
        Filter: DropdownFilter,
      },
      {
        Header: "Next Review",
        accessor: "nextReview",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => (
          <div style={{ textAlign: "center" }}>{formatDate(value)}</div>
        ),
      },
      // {
      //   Header: "Actions",
      //   accessor: "editDelete",
      //   Cell: ({ row }) => (
      //     <div style={{ textAlign: "center" }}>
      //      <span
      //         className="edit-icon"
      //         onClick={() => handleEdit(row.original)}
      //       >
      //         <OverlayTrigger
      //           placement="top"
      //           overlay={
      //             <Tooltip>
      //               <strong>Edit</strong>
      //             </Tooltip>
      //           }
      //         >
      //           <Edit size={20} color="blue" />
      //         </OverlayTrigger>
      //       </span>
      //       <span
      //         className="comment-icon"
      //         onClick={() => {
      //           navigate(`/admin/projects/comment/${row.original.id}`, {
      //             state: { selectedProject: row.original },
      //           });
      //         }}
      //       >
      //         <OverlayTrigger
      //           placement="top"
      //           overlay={
      //             <Tooltip>
      //               <strong>Comment</strong>
      //             </Tooltip>
      //           }
      //         >
      //           <MessageSquare size={20} color="blue" />
      //         </OverlayTrigger>
      //       </span>

      //       <span
      //         className="delete-icon"
      //         onClick={() => openDeleteModal(row.original)}
      //       >
      //         <OverlayTrigger
      //           placement="top"
      //           overlay={
      //             <Tooltip>
      //               <strong>Delete</strong>
      //             </Tooltip>
      //           }
      //         >
      //           <Trash2 size={20} color="red" />
      //         </OverlayTrigger>
      //       </span>
      //       <span
      //         className="info-icon"
      //         onClick={() => {
      //           navigate(`/user/projects/info/${row.original.id}`, {
      //             state: { selectedProject: row.original },
      //           });
      //         }}
      //       >
      //         <OverlayTrigger
      //           placement="top"
      //           overlay={
      //             <Tooltip>
      //               <strong>Info</strong>
      //             </Tooltip>
      //           }
      //         >
      //           <Info
      //             size={20}
      //             color="blue"
      //             style={{ marginLeft: "10px", marginBottom: "8px" }}
      //           />
      //         </OverlayTrigger>
      //       </span>
      //     </div>
      //   ),
      // },
    ],
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page, // Updated to use the "page" property
    // eslint-disable-next-line
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    setGlobalFilter,
    gotoPage, // Add gotoPage as a prop
    canNextPage,
    pageCount,
    canPreviousPage,
  } = useTable(
    {
      columns,
      data: localData,
      initialState: {
        pageIndex: 0, // Initial page index
        pageSize: 10, // Set the default page size to 8
        globalFilter: "",
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    usePagination
  );

  React.useEffect(() => {
    setGlobalFilter(globalFilter); // This is how you set the global filter
  }, [globalFilter, setGlobalFilter]);

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setGlobalFilter(value); // Set the filter globally
    setFilterInput(value); // Update the state with the new search input
  };
  const itemsPerPage = 4;
  const [currentPageGroup, setCurrentPageGroup] = useState(0);

  // Calculate the range of pages to display based on the current group
  const startIndex = currentPageGroup * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Create an array of page numbers for the current group
  const circleOptions = Array.from(
    { length: pageCount },
    (_, index) => index + 1
  ).slice(startIndex, endIndex);

  return (
    <>
      <UserProjectHeader></UserProjectHeader>
      <div className="main main-app p-3 p-lg-4">
        <div className="d-md-flex align-items-center justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="#">Project Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page"></li>
            </ol>
          </div>

          <div style={{ textAlign: "center", padding: "10px" }}>
            {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
          </div>
          <div className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={openAddModal}
            >
              <i className="ri-add-line fs-18 lh-1"></i>Add Project
            </Button>

            {/* Add Task Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add Project</Modal.Title>
              </Modal.Header>
              <div style={{ textAlign: "center", padding: "10px" }}>
                {alertMessage && (
                  <Alert variant={alertType}>{alertMessage}</Alert>
                )}
              </div>

              <Modal.Body>
                <Container>
                  <Form>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Project Name{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="projectName"
                        value={taskData.projectName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={taskData.description}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Lead Name{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Select
                        options={[...leadSelectOptions].sort((a, b) =>
                          a.label.localeCompare(b.label)
                        )}
                        isSearchable={true}
                        value={leadSelectOptions.find(
                          (option) => option.value === taskData.lead
                        )}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "lead",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Owner Name{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Select
                        options={[...ownerSelectOptions].sort((a, b) =>
                          a.label.localeCompare(b.label)
                        )}
                        isSearchable={true}
                        value={ownerSelectOptions.find(
                          (option) => option.value === taskData.owner
                        )}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "owner",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Due Date{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Priority{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="priority"
                        value={taskData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                        <option value="NA">NA</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Status{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={taskData.status}
                        onChange={handleInputChange}
                      >
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>

                        <option value="NOT STARTED">NOT STARTED</option>
                        <option value="ON HOLD">ON HOLD</option>

                        <option value="OVERDUE">OVERDUE</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Next Review</Form.Label>
                      <Form.Control
                        type="date"
                        name="nextReview"
                        value={taskData.nextReview}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmitAdd}>
                  Add
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Edit Modal */}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Project</Modal.Title>
              </Modal.Header>
              <div style={{ textAlign: "center", padding: "10px" }}>
                {alertMessage && (
                  <Alert variant={alertType}>{alertMessage}</Alert>
                )}
              </div>

              <Modal.Body>
                <Container>
                  <Form>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Project Name{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="projectName"
                        value={taskData.projectName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={taskData.description}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Lead Name{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Select
                        options={[...leadSelectOptions].sort((a, b) =>
                          a.label.localeCompare(b.label)
                        )}
                        isSearchable={true}
                        value={leadSelectOptions.find(
                          (option) => option.value === taskData.lead
                        )}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "lead",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Owner Name{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Select
                        options={[...ownerSelectOptions].sort((a, b) =>
                          a.label.localeCompare(b.label)
                        )}
                        isSearchable={true}
                        value={ownerSelectOptions.find(
                          (option) => option.value === taskData.owner
                        )}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "owner",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Due Date{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Priority{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="priority"
                        value={taskData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                        <option value="NA">NA</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        Status{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={taskData.status}
                        onChange={handleInputChange}
                      >
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>

                        <option value="NOT STARTED">NOT STARTED</option>
                        <option value="ON HOLD">ON HOLD</option>

                        <option value="OVERDUE">OVERDUE</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Next Review</Form.Label>
                      <Form.Control
                        type="date"
                        name="nextReview"
                        value={taskData.nextReview}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmitEdit}>
                  Update
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delete Modal */}

            <Modal show={showDeleteModal} onHide={closeDeleteModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this item?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeDeleteModal}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(itemToDelete)}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>

        <Row className="g-12">
          <Col lg="12" md="12" sm="12">
            <Card className="card-one">
              <Card.Body className="overflow px-2 pb-3">
                <div className="grid-container">
                  {/* Table */}
                  <div className="table-responsive">
                    <table {...getTableProps()} className="table-style">
                      {/* Thead */}
                      <thead className="custom-thead">
                        {headerGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, columnIndex) => (
                              <th
                                {...column.getHeaderProps()}
                                className="header-style text-center"
                                key={column.id}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div {...column.getSortByToggleProps()}>
                                    {column.render("Header")}
                                    <span>
                                      {column.isSorted ? (
                                        column.isSortedDesc ? (
                                          <ChevronDown size={16} />
                                        ) : (
                                          <ChevronUp size={16} />
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </span>
                                  </div>
                                  {[2, 3, 4, 5, 6, 7].includes(columnIndex) &&
                                    column.canFilter && (
                                      <div
                                        className="filter-align"
                                        onClick={() =>
                                          openFilter === column.id
                                            ? setOpenFilter(null)
                                            : setOpenFilter(column.id)
                                        }
                                      >
                                        <Filter size={16} />
                                      </div>
                                    )}
                                </div>

                                {openFilter === column.id && (
                                  <div
                                    className="dropdown-filter"
                                    ref={dropdownRef}
                                  >
                                    {column.render("Filter")}
                                  </div>
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>

                      {/* Tbody */}
                      <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                          prepareRow(row);
                          return (
                            <tr {...row.getRowProps()}>
                              {row.cells.map((cell) => {
                                if (cell.column.id === "lead") {
                                  // Render cell for lead with profile image
                                  return (
                                    <td {...cell.getCellProps()}>
                                      <div className="d-flex align-items-center gap-2">
                                        <Avatar
                                          img={
                                            row.original.Lead.profileImage ||
                                            dummyImage
                                          }
                                          alt="Lead Avatar"
                                        />
                                        <span>
                                          {row.original.Lead.displayName}
                                        </span>
                                      </div>
                                    </td>
                                  );
                                } else if (cell.column.id === "owner") {
                                  // Render cell for owner with profile image
                                  return (
                                    <td {...cell.getCellProps()}>
                                      <div className="d-flex align-items-center gap-2">
                                        <Avatar
                                          img={
                                            row.original.Owner.profileImage ||
                                            dummyImage
                                          }
                                          alt="Owner Avatar"
                                        />
                                        <span>
                                          {row.original.Owner.displayName}
                                        </span>
                                      </div>
                                    </td>
                                  );
                                } else {
                                  // Render other cells normally
                                  return (
                                    <td
                                      {...cell.getCellProps()}
                                      className="cell-style"
                                    >
                                      {cell.render("Cell")}
                                    </td>
                                  );
                                }
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <Pagination className="pagination-space pagination-circled mb-0">
                    <Pagination.Item
                      className="pagination-button"
                      disabled={!canPreviousPage}
                      onClick={() => {
                        if (currentPageGroup > 0) {
                          previousPage();
                          setCurrentPageGroup(currentPageGroup - 1); // Decrement the currentPageGroup
                        }
                      }}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </Pagination.Item>
                    <div className="pagination-circle-container">
                      {circleOptions.map((page) => (
                        <Pagination.Item
                          key={page} // Add the key prop here
                          active={pageIndex + 1 === page}
                          onClick={() => gotoPage(page - 1)}
                          className={`pagination-circle ${
                            pageIndex + 1 === page ? "active" : ""
                          }`}
                        >
                          {page}
                        </Pagination.Item>
                      ))}
                    </div>
                    <Pagination.Item
                      className="pagination-button"
                      disabled={!canNextPage}
                      onClick={() => {
                        nextPage();
                        setCurrentPageGroup(currentPageGroup + 1); // Increment the currentPageGroup
                      }}
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </Pagination.Item>
                  </Pagination>
                </div>
                <Footer />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default UserAllProjects;

const DropdownFilter = ({ column }) => {
  const { filterValue = [], setFilter, preFilteredRows, id } = column;
  const options = React.useMemo(() => {
    const values = new Set();
    preFilteredRows.forEach((row) => {
      values.add(row.values[id]);
    });
    return [...values.values()];
  }, [id, preFilteredRows]);

  const [selectAll, setSelectAll] = React.useState(false);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const newValue = selectAll ? [] : options;
    setFilter(newValue.length ? newValue : undefined);
  };

  return (
    <div className="filter-dropdown">
      <div className="filter-header">
        <button className="check-all-button" onClick={toggleSelectAll}>
          {selectAll ? "Uncheck All" : "Check All"}
        </button>
      </div>
      <div className="filter-body">
        {options.map((option, i) => (
          <label key={option.optionId} className="checkbox-label">
            <input
              type="checkbox"
              value={option}
              checked={filterValue.includes(option)}
              onChange={(e) => {
                const checked = e.target.checked;
                const newValue = checked
                  ? [...filterValue, e.target.value]
                  : filterValue.filter((val) => val !== e.target.value);
                setFilter(newValue.length ? newValue : undefined);
              }}
            />
            {option}
          </label>
        ))}
      </div>
      <div className="filter-footer">
        <button className="clear-filter" onClick={() => setFilter(undefined)}>
          Clear
        </button>
      </div>
    </div>
  );
};

function formatDate(inputDate) {
  if (!inputDate) {
    // Handle null or undefined inputDate
    return "No Date"; // or any other placeholder you'd like to use
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const parts = inputDate.split("-");
  if (parts.length === 3) {
    const year = parts[0].slice(2); // Get the last two digits of the year
    const month = months[parseInt(parts[1], 10) - 1]; // Adjust month to be zero-based
    const day = parts[2];

    return `${day} ${month}, ${year}`;
  }

  return inputDate; // Return the input as is if it doesn't match the format
}
