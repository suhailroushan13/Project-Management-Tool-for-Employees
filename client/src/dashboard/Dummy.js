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
  Row,
  Tooltip,
} from "react-bootstrap";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  MessageSquare,
  Trash2,
} from "react-feather";
import "../assets/css/react-datepicker.min.css";

import ReactDatePicker from "react-datepicker";

// import { } from "feather-icons-react";

import { Link } from "react-router-dom";
import Select from "react-select";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import { leadArray, ownerArray, owners } from "../apps/data/Leadonwer";
import img from "../assets/img/user.png";
import Avatar from "../components/Avatar";
import config from "../config.json";
import Footer from "../layouts/Footer";
import ProjectHeader from "../layouts/ProjectHeader";
import "./Table.css";
// import "./New.css";

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
          <label key={i} className="checkbox-label">
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

///////////////////////////////////////////////////////////

const ProjectManagement = () => {
  const url = config.PROD_URL;
  console.log(url);

  const [localData, setLocalData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskData, setTaskData] = useState({
    projectId: "",
    projectName: "",
    description: "",
    lead: "",
    owner: "",
    newEndDate: "",
    priority: "MEDIUM",
    status: "NOT STARTED",
    nextReview: "",
  });

  // eslint-disable-next-line
  const showAlert = () => {
    setShowSuccessAlert(true);

    // Hide the alert after 5 seconds
    const timeoutId = setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  };
  // Trigger the showAlert function when the component mounts
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccessAlert(false);
    }, 4000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [showSuccessAlert]);

  // eslint-disable-next-line
  const [description, setDescription] = useState("");

  // eslint-disable-next-line
  const [leadOptions, setLeadOptions] = useState([]);
  // eslint-disable-next-line
  const [ownerOptions, setOwnerOptions] = useState("");
  // eslint-disable-next-line
  const [selectedLead, setSelectedLead] = useState("");
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

  // Handle modal open and close
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Clear form fields
    setDescription("");
    setSelectedLead("");
    setSelectedOwner("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    if (
      taskData.projectName === "" ||
      taskData.lead === "" ||
      taskData.owner === "" ||
      taskData.newEndDate === "" ||
      taskData.priority === "" ||
      taskData.status === ""
    ) {
      setShowEmptyFieldAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    try {
      let response;
      if (editingItem) {
        // Handle editing logic here, e.g., make a PUT request to update the item
        response = await axios.put(
          `${url}/api/projects/updateproject/${editingItem.projectId}`,
          taskData
        );
        console.log("Updated item: ", response.data);
      } else {
        // Handle creating a new item here, e.g., make a POST request to create a new item
        response = await axios.post(`${url}/api/projects/addproject`, taskData);
        console.log("Created item: ", response.data);

        // Set showSuccessAlert to true to display the alert
        setShowSuccessAlert(true);
      }

      closeModal(); // Close the modal
      setEditingItem(null);
      setTaskData({
        projectId: "",
        projectName: "",
        description: "",
        lead: "",
        owner: "",
        newEndDate: "",
        priority: "MEDIUM",
        status: "NOT STARTED",
        nextReview: "",
      });
      fetchData(); // Refresh the data after editing or creating
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Make an API call to delete the project by its ID
      const response = await axios.delete(
        `${url}/api/projects/deleteproject/${itemToDelete.projectId}`
      );

      if (response.data.success) {
        // Delete the item from the local data
        const updatedData = localData.filter((i) => i !== itemToDelete);
        setLocalData(updatedData);
        setShowDeleteModal(false); // Close the delete confirmation modal
      } else {
        console.error("Error deleting project:", response.data.message);
        // Handle error here (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      // Handle error here (e.g., display an error message)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getallprojects`);
      console.log(response.data);
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

  const tableStyles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    th: {
      background: "#f2f2f2",
      fontWeight: "bold",
      padding: "8px",
      textAlign: "left",
      borderBottom: "1px solid #ccc",
    },
    td: {
      padding: "8px",
      textAlign: "left",
      borderBottom: "1px solid #ccc",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "16px",
    },
    paginationButton: {
      padding: "8px 16px",
      margin: "0 4px",
      cursor: "pointer",
      border: "1px solid #ccc",
      background: "#f2f2f2",
      color: "#333",
      borderRadius: "4px",
    },
  };

  const handleEdit = (item) => {
    // Populate the form with the selected item's data for editing
    setTaskData({
      projectId: item.projectId,
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
    setShowModal(true);
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
          <div style={{ textAlign: "justify" }}>{value}</div>
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
              className="comment-icon"
              onClick={() => handleEdit(row.original)}
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
          </div>
        ),
      },
    ],
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
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    rows,
    headerGroups,
    page, // Updated to use the "page" property
    state: { pageIndex, pageSize },
    setGlobalFilter,
    // Add the following pagination properties
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = useTable(
    {
      columns,
      data: localData,
      initialState: {
        pageIndex: 0, // Initial page index
        pageSize: 7, // Set the default page size to 8
      },
      // ... other configurations
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    usePagination // Add the usePagination hook
  );

  const leads = [
    { value: "firoz", label: "Firoz" },
    { value: "veera", label: "Veera" },
    { value: "anand", label: "Anand" },
    { value: "raj", label: "Raj" },
    { value: "sanjay", label: "Sanjay" },
    { value: "meera", label: "Meera" },
  ];

  const pageCount = Math.ceil(localData.length / pageSize);

  return (
    <>
      <ProjectHeader></ProjectHeader>
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

          {showSuccessAlert && (
            <Alert variant="success">Project Added Successfully!</Alert>
          )}

          <div className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={openModal}
            >
              <i className="ri-add-line fs-18 lh-1"></i>Add Project
            </Button>

            {/* Add Task Modal */}
            <Modal show={showModal} onHide={closeModal}>
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
                      <Form.Control
                        as="select"
                        name="lead"
                        value={taskData.lead}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Lead Name</option>
                        {leadArray.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Owner Name</Form.Label>
                      <Form.Control
                        as="select"
                        name="owner"
                        value={taskData.owner}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Owner Name</option>
                        {ownerArray.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Due Date</Form.Label>
                      {/* <Form.Control
                        type="date"
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={handleInputChange}
                      /> */}
                      <ReactDatePicker
                        dateFormat="MMMM dd, yyyy"
                        selected={startDate}
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={(date) => setStartDate(date)}
                        className="form-control"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Priority</Form.Label>
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
                      <Form.Label>Status</Form.Label>
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
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Submit
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
          <Col xl="12">
            <Card className="card-one">
              <Card.Body className="overflow px-2 pb-3">
                <div className="grid-container">
                  {/* Table */}
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
                                      <Avatar img={img} />
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
                                      <Avatar img={img} />
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
                  <div
                    className="pagination-container"
                    style={tableStyles.pagination}
                  >
                    <button
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                      className="pagination-button"
                      style={tableStyles.paginationButton}
                    >
                      Previous
                    </button>
                    <span className="pagination-current-page">
                      Page {pageIndex + 1} of {pageCount}
                    </span>
                    <button
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                      className="pagination-button"
                      style={tableStyles.paginationButton}
                    >
                      Next
                    </button>
                  </div>
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

export default ProjectManagement;
