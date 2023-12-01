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
  Table,
  Tooltip,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";

import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  Info,
  MessageSquare,
  Trash2,
} from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import Loader from "../Root/Loader.js";
import Reload from "../Root/Reload.js";
import { getLeads, getRest } from "../apps/data/Leadowner";
import "../assets/css/react-datepicker.min.css";
import {
  default as dummyImage,
  default as user,
} from "../assets/users/user.png";
import Avatar from "../components/Avatar";
import config from "../config.json";
import Footer from "../layouts/Footer";
import UserProjectHeader from "../layouts/UserProjectHeader";

import { useTableContext } from "../Context/TableContext";

// //////////////////////

import "chart.js/auto";
import ReactApexChart from "react-apexcharts";

import Select from "react-select";

// import "../";
///////////////////////////////////////////////////////////

const UserDashboard = () => {
  const url = config.URL;
  const navigate = useNavigate();

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

  useEffect(() => {
    Prism.highlightAll();
    fetchData();
    fetchAllData();
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

  useEffect(() => {
    // existing code...
  }, [leadSelectOptions, ownerSelectOptions]);

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
    setTaskData({
      projectName: "",
      lead: "",
      owner: "",
      newEndDate: "",
      priority: "",
      status: "",
    });
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
      showAlert("Error adding project. Please try again.", "danger");
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
      showAlert("Error adding project. Please try again.", "danger");
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
        showAlert("Error adding project. Please try again.", "danger");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      showAlert("Error adding project. Please try again.", "danger");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  //////// Get Specific User Data /////////////////////////////

  let fetchData = async () => {
    try {

      const response = await axios.get(
        `${url}/api/projects/getbylead/${userName}`
      );


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
    // Assuming 'item' has fields like 'leadId' and 'ownerId' which store the IDs
    setTaskData({
      id: item.id,
      projectName: item.projectName,
      description: item.description,
      // lead: item.lead, // Set to the ID of the lead
      // owner: item.owner, // Set to the ID of the owner
      lead: item.leadId, // Assuming 'item.leadId' is the ID of the lead
      owner: item.ownerId,
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
        Cell: ({ value }) => (
          <div style={{ textAlign: "left" }}>
            {value.length > 30 ? value.substring(0, 50) + "..." : value}
          </div>
        ),
      },
      {
        Header: "Lead",
        accessor: "lead",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },
      {
        Header: "Owner",
        accessor: "owner",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
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
      {
        Header: "Actions",
        accessor: "editDelete",
        Cell: ({ row }) => (
          <div style={{ textAlign: "center" }}>
            <span
              className="edit-icon"
              onClick={() => handleEdit(row.original)}
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
              onClick={() => openDeleteModal(row.original)}
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
            {/* <span
              className="comment-icon"
              onClick={() => {
                navigate(`/user/projects/comment/${row.original.id}`, {
                  state: { selectedProject: row.original },
                });
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    <strong>Comment</strong>
                  </Tooltip>
                }
              >
                <MessageSquare size={20} color="blue" />
              </OverlayTrigger>
            </span> */}
            <span
              className="info-icon"
              onClick={() => {
                navigate(`/user/projects/info/${row.original.id}`, {
                  state: { selectedProject: row.original },
                });
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    <strong>Info</strong>
                  </Tooltip>
                }
              >
                <Info
                  size={20}
                  color="blue"
                  style={{ marginLeft: "10px", marginBottom: "8px" }}
                />
              </OverlayTrigger>
            </span>
          </div>
        ),
      },
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
    page,
    setGlobalFilter, // Notice e
    state: { pageIndex, pageSize }, // globalFilter state is destructured from the state
    canNextPage,
    nextPage,
    previousPage,
    gotoPage, // Add gotoPage as a prop
    pageCount,
    canPreviousPage,
  } = useTable(
    {
      columns,
      data: localData,
      initialState: { pageIndex: 0, pageSize: 10, globalFilter: "" }, // Set an initial state for globalFilter
    },
    useFilters, // use this hook if you have column filters
    useGlobalFilter, // This hook is for the global filter
    useSortBy,
    usePagination
  );

  // Effect for setting the global filter
  React.useEffect(() => {
    setGlobalFilter(globalFilter); // This is how you set the global filter
  }, [globalFilter, setGlobalFilter]);

  // Handler for the search input change
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

  async function loadAndProcessLeadsAndOwners() {
    try {
      // Fetch leads and owners data concurrently
      const [leads, owners] = await Promise.all([getLeads(), getRest()]);

      // Process the leads data
      const leadSelectOptions = leads.map((lead) => ({
        value: lead.value, // assuming you want to use the transformed value
        label: lead.label,
      }));

      // Process the owners data
      // Assuming owners data can be processed in a similar way
      const ownerSelectOptions = owners.map((owner) => ({
        value: owner.value, // modify as per the structure of owner data
        label: owner.label,
      }));

      // Now you can use both leadSelectOptions and ownerSelectOptions for your requirements
      return { leadSelectOptions, ownerSelectOptions };
    } catch (error) {
      console.error(
        "Error while loading and processing leads and owners:",
        error
      );
    }
  }

  loadAndProcessLeadsAndOwners();

  // User DashBoard
  const [leadData, setLeadData] = useState([]);
  // const [localData, setLocalData] = useState([]);

  const name = JSON.parse(localStorage.getItem("user"))?.name;

  useEffect(() => {
    Prism.highlightAll();
    fetchData();
    fetchAllData();
  }, []);

  fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getleadsdata`);
      setLeadData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  function run() {
    // Check if the page has already been reloaded once
    if (!sessionStorage.getItem("hasReloaded")) {
      // Set a flag indicating the page is going to be reloaded
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload(true);
    }
  }
  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getall`);

      const sortedData = response.data
        .filter((item) => item.lead === name)
        .sort((a, b) => b.id - a.id);

      if (sortedData.length == 0) {
        // window.location.reload(true);
        // run();
      } else {
        setLocalData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const userStatusCounts = localData.reduce((counts, project) => {
    const status = project.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  function segregateStatusByLead(projects) {
    const leadStatusCounts = {};

    projects.forEach((project) => {
      const lead = project.lead;
      const status = project.status;

      if (!leadStatusCounts[lead]) {
        leadStatusCounts[lead] = {};
      }

      if (!leadStatusCounts[lead][status]) {
        leadStatusCounts[lead][status] = 1;
      } else {
        leadStatusCounts[lead][status]++;
      }
    });

    return leadStatusCounts;
  }

  const segregated = segregateStatusByLead(localData);

  const extractArrays = (obj) => {
    const result = {};

    for (const key in obj) {
      result[key] = {
        keys: Object.keys(obj[key]),
        values: Object.values(obj[key]),
      };
    }

    return result;
  };

  const extractedData = extractArrays(segregated);

  const legendFontStyle = {
    fontFamily: '"Open Sans", sans-serif', // Use Open Sans as the primary font, fallback to sans-serif if it's not available
    fontSize: "16px", // A legible font size for legends
    fontWeight: "bold", // You can use 'normal' or 'bold' based on your preference
  };

  const specificUserData = extractedData[name];
  const UserValuesArray = specificUserData ? specificUserData.values : [];
  const UserKeysArray = specificUserData ? specificUserData.keys : [];

  const chartWidth = 200;

  const UserOpt = {
    labels: UserKeysArray,
    legend: {
      fontFamily: legendFontStyle.fontFamily,
      fontSize: legendFontStyle.fontSize,
    },
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            width: chartWidth,
            height: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const Completedcount = localData.filter(
    (project) => project.status === "COMPLETED"
  ).length;
  const onHoldCount = localData.filter(
    (project) => project.status === "ON HOLD"
  ).length;
  const inProgress = localData.filter(
    (project) => project.status === "IN PROGRESS"
  ).length;
  const notStarted = localData.filter(
    (project) => project.status === "NOT STARTED"
  ).length;


  const userValuesArray = Object.values(userStatusCounts);
  const userKeysArray = Object.keys(userStatusCounts);

  const userOpt = {
    labels: userKeysArray,
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const statusCounts = {};
  localData.forEach((project) => {
    const status = project.status;
    if (!statusCounts[status]) {
      statusCounts[status] = 1;
    } else {
      statusCounts[status]++;
    }
  });

  const chartLabels = Object.keys(statusCounts);
  const chartData = Object.values(statusCounts);
  const maxCount = Math.ceil(localData.length / 10) * 10;

  const hasData = dataBar.labels.length > 0;

  const optionBar = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Status",
        },
      },
      y: {
        beginAtZero: true,
        max: maxCount,
        title: {
          display: true,
          text: "Projects",
        },
      },
    },
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
      <UserProjectHeader></UserProjectHeader>
      <div className="main main-app p-3 p-lg-4">
        <div className="d-md-flex align-items-center justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="#">Project Management Tool</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page"></li>
            </ol>
          </div>

          <div style={{ textAlign: "center", padding: "10px" }}>
            {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
          </div>

          <div className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
            {/* Add Task Modal */}

            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={openAddModal}
            >
              <i className="ri-add-line fs-18 lh-1"></i>Add Project
            </Button>
            {/* <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={openAddModal}
            >
              <i className="ri-add-line fs-18 lh-1"></i>Add Project
            </Button> */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add Project</Modal.Title>
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
                      <Form.Label>Project Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
                      <Form.Label>Lead Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
                      <Form.Label>Owner Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
                      <Form.Label>Due Date</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Form.Control
                        type="date"
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Priority</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Select
                        options={[
                          { value: "HIGH", label: "HIGH" },
                          { value: "MEDIUM", label: "MEDIUM" },
                          { value: "LOW", label: "LOW" },
                          { value: "NA", label: "NA" },
                        ]}
                        isSearchable={true}
                        value={[
                          { value: "HIGH", label: "HIGH" },
                          { value: "MEDIUM", label: "MEDIUM" },
                          { value: "LOW", label: "LOW" },
                          { value: "NA", label: "NA" },
                        ].find((option) => option.value === taskData.priority)}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "priority",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Select
                        options={[
                          { value: "COMPLETED", label: "COMPLETED" },
                          { value: "IN PROGRESS", label: "IN PROGRESS" },
                          { value: "NOT STARTED", label: "NOT STARTED" },
                          { value: "ON HOLD", label: "ON HOLD" },
                          { value: "OVERDUE", label: "OVERDUE" },
                        ]}
                        isSearchable={true}
                        value={[
                          { value: "COMPLETED", label: "COMPLETED" },
                          { value: "IN PROGRESS", label: "IN PROGRESS" },
                          { value: "NOT STARTED", label: "NOT STARTED" },
                          { value: "ON HOLD", label: "ON HOLD" },
                          { value: "OVERDUE", label: "OVERDUE" },
                        ].find((option) => option.value === taskData.status)}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "status",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
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
                      <Form.Label>Project Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
                      <Form.Label>Lead Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
                      <Form.Label>Owner Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
                      <Form.Label>Due Date</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Form.Control
                        type="date"
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Priority</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Select
                        options={[
                          { value: "HIGH", label: "HIGH" },
                          { value: "MEDIUM", label: "MEDIUM" },
                          { value: "LOW", label: "LOW" },
                          { value: "NA", label: "NA" },
                        ]}
                        isSearchable={true}
                        value={[
                          { value: "HIGH", label: "HIGH" },
                          { value: "MEDIUM", label: "MEDIUM" },
                          { value: "LOW", label: "LOW" },
                          { value: "NA", label: "NA" },
                        ].find((option) => option.value === taskData.priority)}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "priority",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Select
                        options={[
                          { value: "COMPLETED", label: "COMPLETED" },
                          { value: "IN PROGRESS", label: "IN PROGRESS" },
                          { value: "NOT STARTED", label: "NOT STARTED" },
                          { value: "ON HOLD", label: "ON HOLD" },
                          { value: "OVERDUE", label: "OVERDUE" },
                        ]}
                        isSearchable={true}
                        value={[
                          { value: "COMPLETED", label: "COMPLETED" },
                          { value: "IN PROGRESS", label: "IN PROGRESS" },
                          { value: "NOT STARTED", label: "NOT STARTED" },
                          { value: "ON HOLD", label: "ON HOLD" },
                          { value: "OVERDUE", label: "OVERDUE" },
                        ].find((option) => option.value === taskData.status)}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "status",
                              value: selectedOption.value,
                            },
                          })
                        }
                      />
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
        <Col xl="12" className="col-12 pb-3">
          <Row className="g-6 g-md-3 g-lg-2 ">
            {localData.length > 0 &&
              renderCard(localData.length, "ri-file-list-line", "Total")}
            {Completedcount > 0 &&
              renderCard(Completedcount, "ri-check-double-line", "Completed")}
            {onHoldCount > 0 &&
              renderCard(onHoldCount, "ri-information-line", "On Hold")}
            {notStarted > 0 &&
              renderCard(notStarted, "ri-draft-fill", "Not Started")}
            {inProgress > 0 &&
              renderCard(inProgress, "ri-restart-line", "In Progress")}
          </Row>
        </Col>

        {hasData && (
          <>
            <h2>Total Projects Alive</h2>
            <Card className="card">
              <Card.Body>
                <Bar
                  data={dataBar}
                  options={optionBar}
                  height={200}
                  width={200}
                  className="ht-400"
                />
              </Card.Body>
            </Card>
          </>
        )}

        <Card className="card-one">
          <div className="grid-container">
            {/* Table */}
            <div className="table-responsive">
              <table {...getTableProps()} className="table-style">
                {/* Thead */}
                <thead>
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
                            <div className="dropdown-filter" ref={dropdownRef}>
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
                      <tr
                        className="table-active"
                        {...row.getRowProps()}
                        key={row.id}
                      >
                        {row.cells.map((cell, cellIndex) => (
                          <td
                            {...cell.getCellProps()}
                            className="cell-style"
                            key={cell.id}
                          >
                            {cellIndex === 2 ? (
                              <>
                                <div className="d-flex align-items-center gap-2">
                                  <Avatar
                                    img={getLeadImage(row.original.lead)}
                                  />
                                  <div>
                                    <h6 className="mb-0">
                                      {cell.render("Cell")}
                                    </h6>
                                    <span className="fs-xs text-secondary people">
                                      Role
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : cellIndex === 3 ? (
                              <>
                                <div className="d-flex align-items-center gap-2">
                                  <Avatar
                                    img={
                                      getLeadImage(row.original.owner) ||
                                      dummyImage
                                    }
                                  />

                                  <div>
                                    <h6 className="mb-0">
                                      {cell.render("Cell")}
                                    </h6>
                                    <span className="fs-xs text-secondary people">
                                      Role
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              cell.render("Cell")
                            )}
                          </td>
                        ))}
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
        </Card>
      </div>
    </>
  );
};

export default UserDashboard;

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
