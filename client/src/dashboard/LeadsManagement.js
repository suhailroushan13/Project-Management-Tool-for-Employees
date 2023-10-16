/* eslint-disable */
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/react-datepicker.min.css";
import img from "../assets/img/user.png";
import Avatar from "../components/Avatar";
import config from "../config.json";
import Footer from "../layouts/Footer";
// import leadsDatajson from "../data/Leads.js";
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
  MessageSquare,
  Trash2,
} from "react-feather";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import ProjectHeader from "../layouts/ProjectHeader";

import "./Table.css";
///////////////////////////////////////////////////////////

const LeadsManagement = () => {
  const url = config.PROD_URL;
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // console.log(leadsDatajson);

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
  });

  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    role: "",
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
      setShowEmptyFieldAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    try {
      const response = await axios.post(`${url}/api/projects/add`, taskData);
      console.log("Created item: ", response.data);

      // Clear the taskData object after successful submission
      setTaskData({
        projectName: "",
        lead: "",
        owner: "",
        newEndDate: "",
        priority: "",
        status: "",
      });

      setShowSuccessAlert(true);
      closeAddModal();
      fetchData();
    } catch (error) {
      console.error("Error: ", error);
      // Optionally, show an error alert or message to the user
      // setShowErrorAlert(true);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

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

    if (!editingItem) return;

    try {
      const response = await axios.put(
        `${url}/api/projects/update/${editingItem.id}`,
        taskData
      );
      console.log("Updated item: ", response.data);
      closeEditModal(); // Close the modal
      setEditingItem(null);
      setTaskData(taskData);
      fetchData();
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Make an API call to delete the project by its ID
      const response = await axios.delete(
        `${url}/api/projects/delete/${itemToDelete.id}`
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
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/users/getall`);
      console.log(response.data);
      // Sort the array in descending order based on the "id" field
      const sortedData = response.data.sort((a, b) => a.id - b.id);

      setLocalData(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEdit = (item) => {
    // Populate the form with the selected item's data for editing
    setEditedData({
      name: item.name,
      email: item.email,
      role: item.role,
    });
    // setTaskData({
    //   id: item.id,
    //   projectName: item.projectName,
    //   description: item.description,
    //   lead: item.lead,
    //   owner: item.owner,
    //   newEndDate: item.newEndDate,
    //   priority: item.priority,
    //   status: item.status,
    //   nextReview: item.nextReview,
    // });
    setEditingItem(item);
    setShowEditModal(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "S.NO",
        accessor: "id",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        width: 100,
      },
      {
        Header: "Name",
        accessor: "name",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => (
          <div style={{ textAlign: "justify" }}>{value}</div>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },
      {
        Header: "Profile",
        accessor: "path",
        Cell: ({ row }) => <img src={row.values.path} alt={row.values.name} />,
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
    page, // Updated to use the "page" property
    // eslint-disable-next-line
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    gotoPage, // Add gotoPage as a prop
    canNextPage,
    pageCount,
    canPreviousPage,
  } = useTable(
    {
      columns,
      // data: leadsDatajson,
      initialState: {
        pageIndex: 0, // Initial page index
        pageSize: 6, // Set the default page size to 8
      },
    },

    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    usePagination
  );

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
      <ProjectHeader></ProjectHeader>
      <div className="main main-app p-3 p-lg-4">
        <div className="d-md-flex align-items-center justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="#">Leads Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page"></li>
            </ol>
          </div>

          {/* {showSuccessAlert && (
            <Alert variant="success">Project Added Successfully!</Alert>
          )} */}

          <div className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
            {/* <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={openAddModal}
            >
              <i className="ri-add-line fs-18 lh-1"></i>Add Project
            </Button> */}

            {/* Add Task Modal */}
            {/* <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
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
                      <Form.Control
                        type="date"
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={handleInputChange}
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
            </Modal> */}

            {/* Edit Modal */}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Project</Modal.Title>
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
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={editedData?.name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        value={editedData?.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        name="role"
                        value={editedData?.role}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    {/* <Form.Group>
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
                      <Form.Control
                        type="date"
                        name="newEndDate"
                        value={taskData.newEndDate}
                        onChange={handleInputChange}
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
                    </Form.Group> */}
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
                  Edit
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
                                  {cellIndex === 3 ? (
                                    <>
                                      <div className="d-flex align-items-center gap-2">
                                        {console.log(cell.row.original.path)}
                                        {/* <Avatar img={cell.row.original.path} /> */}
                                        <div>
                                          <h6 className="mb-0">
                                            {cell.row.original.role}
                                          </h6>
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
                          key={page}
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

export default LeadsManagement;

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
