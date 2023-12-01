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
import { ChevronDown, ChevronUp, Edit, Filter, Trash2 } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { getLeads, getRest } from "../apps/data/Leadowner";
import "../assets/css/react-datepicker.min.css";
import img from "../assets/img/user.png";
import Avatar from "../components/Avatar";
import config from "../config.json";
import AdminProjectHeader from "../layouts/AdminProjectHeader";
import Footer from "../layouts/Footer";

import Select from "react-select";
import { useTableContext } from "../Context/TableContext";

import dummyImage from "../assets/users/user.png";

import "./Project.css";
///////////////////////////////////////////////////////////

const AdminAdminManagement = () => {
  const url = config.URL;
  const navigate = useNavigate();

  const [localData, setLocalData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const { globalFilter } = useTableContext();
  const [showPassword, setShowPassword] = useState(false);

  const [adminData, setAdminData] = useState({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    password: "",
    profileImage: "",
    role: "Admin",
    title: "",
  });

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
    setAdminData({
      fullName: "",
      email: "",
      phone: "",
      role: "Admin",
      password: "",
      profileImage: "",
      role: "",
      title: "",
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    // Clear form fields for Add modal (if necessary)
  };

  // Handle modal open and close for Edit
  // eslint-disable-next-line
  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };
  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    if (
      !adminData.fullName ||
      !adminData.displayName ||
      !adminData.email ||
      !adminData.phone ||
      !adminData.password ||
      !adminData.role ||
      !adminData.title
    ) {
      showAlert("Please fill out all required fields.", "danger");

      return;
    }

    try {
      const response = await axios.post(`${url}/api/users/add`, adminData);
      showAlert("Lead Added Successfully!", "success");
      closeAddModal();

      // Clear the taskData object after successful submission

      setAdminData({
        fullName: "",
        email: "",
        phone: "",
        role: "User",
        password: "",
        profileImage: "",
        role: "",
        title: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error: ", error);
      showAlert(`${error.response.data.message}`, "danger");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    // Check if the password field is not empty, indicating a password update
    if (adminData.password.trim() !== "") {
      try {
        await axios.put(`${url}/api/users/update/${editingItem.id}`, {
          password: adminData.password, // Only send the password for update
        });
        showAlert("Password Updated Successfully!", "success");
      } catch (error) {
        console.error("Error updating password: ", error);
        showAlert(`${error.response.data.message}`, "danger");
      }
    }

    // Check for changes in other fields (excluding the password)
    const dataToUpdate = {};
    for (const key in adminData) {
      if (key !== "password" && adminData[key] !== editingItem[key]) {
        dataToUpdate[key] = adminData[key];
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      // No changes detected in other fields, and password update handled separately
      if (adminData.password.trim() !== "") {
        showAlert("Password Updated", "success");
      } else {
        showAlert("No changes detected to update.", "info");
      }
      return;
    }

    try {
      await axios.put(
        `${url}/api/users/update/${editingItem.id}`,
        dataToUpdate
      );
      closeEditModal();
      setEditingItem(null);
      setAdminData(adminData); // Consider resetting this to the initial state if needed
      showAlert("Admin Updated Successfully!", "success");
      fetchData();
    } catch (error) {
      console.error("Error updating user: ", error);
      showAlert(`${error.response.data.message}`, "danger");
    }
  };

  const handleDelete = async () => {
    try {
      // Make an API call to delete the project by its ID
      const response = await axios.delete(
        `${url}/api/users/delete/${itemToDelete.id}`
      );

      if (response.data.success) {
        // Delete the item from the local data
        const updatedData = localData.filter((i) => i !== itemToDelete);
        setLocalData(updatedData);
        setShowDeleteModal(false); // Close the delete confirmation modal
        showAlert("Lead Deleted Successfully!", "success");
      } else {
        console.error("Error deleting lead:", response.data.message);
        showAlert(`${error.response.data.message}`, "danger");
        // Handle error here (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      showAlert(`${error.response.data.message}`, "danger");

      // Handle error here (e.g., display an error message)
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/users/getalladmins`);
      // Sort the array in descending order based on the "id" field
      const sortedData = response.data.sort((a, b) => a.id - b.id);

      setLocalData(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    // Construct an event-like object
    const event = {
      target: {
        name, // Use the passed name
        value: selectedOption ? selectedOption.value : "", // Handle null/undefined option
      },
    };

    // Call the existing handleInputChange function with this event
    handleInputChange(event);
  };

  const handleEdit = (item) => {
    // Populate the form with the selected item's data for editing
    setAdminData({
      id: item.id,
      fullName: item.fullName,
      displayName: item.displayName,
      email: item.email,
      phone: item.phone ? item.phone : null,
      password: "", // Set password to an empty string by default
      role: item.role,
      title: item.title,
    });
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
        Header: "Full Name",
        accessor: "fullName",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
      },
      {
        Header: "Display Name",
        accessor: "displayName",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
      },

      {
        Header: "Email",
        accessor: "email",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },
      {
        Header: "Phone",
        accessor: "phone",
        Filter: DropdownFilter,
        filter: multiSelectFilterFn,

        Cell: ({ value }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {value ? (
              <>
                <i
                  className="ri-whatsapp-line"
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    color: "#25D366",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/${value}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                ></i>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/${value}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                >
                  {value}
                </div>
              </>
            ) : (
              <div style={{ cursor: "pointer" }}></div>
            )}
          </div>
        ),
      },
      {
        Header: "Last Login",
        accessor: "lastActive",
        Cell: ({ value }) => (
          <div style={{ textAlign: "center" }}>{`🟢 ${value}`}</div>
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
            {/* <span
              className="comment-icon"
              onClick={() => {
                navigate(`/projects/comment/${row.original.id}`, {
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
      initialState: { pageIndex: 0, pageSize: 6, globalFilter: "" }, // Set an initial state for globalFilter
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

  return (
    <>
      <AdminProjectHeader></AdminProjectHeader>
      <div className="main main-app p-3 p-lg-4">
        <div className="d-md-flex align-items-center justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="#">Leads </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page"></li>
            </ol>
          </div>

          <div className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={openAddModal}
            >
              <i className="ri-add-line fs-18 lh-1"></i>Add Admin
            </Button>
            {showEmptyFieldAlert && (
              <div className="alert alert-danger">
                Please fill out all required fields.
              </div>
            )}

            {/* Add Task Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add Lead</Modal.Title>
              </Modal.Header>
              <br></br>
              <div style={{ textAlign: "center", padding: "10px" }}>
                {alertMessage && (
                  <Alert variant={alertType}>{alertMessage}</Alert>
                )}
              </div>

              <Modal.Body>
                <Container>
                  <Form>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={adminData.fullName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                      <Form.Label>Display Name</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Form.Control
                        type="text"
                        name="displayName"
                        value={adminData.displayName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Form.Control
                        type="text"
                        name="email"
                        value={adminData.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <br></br>
                    <div className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <div className="input-group">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter New Password"
                          name="password"
                          value={adminData.password}
                          onChange={handleInputChange}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-secondary"
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
                    </div>

                    <br></br>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Form.Control
                        type="text"
                        rows={3}
                        placeholder="+91961821XXXX"
                        name="phone"
                        value={adminData.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Select
                        name="role"
                        isSearchable={true}
                        value={
                          adminData.role
                            ? { value: adminData.role, label: adminData.role }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange("role", selectedOption)
                        }
                        options={[{ value: "Admin", label: "Admin" }]}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      <Form.Control
                        type="text"
                        name="title"
                        value={adminData.title}
                        placeholder="Intern, Software Engineer, Senior Executive, Engineer, Director"
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
                <Modal.Title>Edit Lead</Modal.Title>
              </Modal.Header>
              {showEmptyFieldAlert && (
                <div className="alert alert-danger">
                  Please fill out all required fields.
                </div>
              )}{" "}
              <div style={{ textAlign: "center", padding: "10px" }}>
                {alertMessage && (
                  <Alert variant={alertType}>{alertMessage}</Alert>
                )}
              </div>
              <Modal.Body>
                <Container>
                  <Form>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={adminData.fullName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Display Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="displayName"
                        value={adminData.displayName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        value={adminData.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={adminData.password}
                        onChange={handleInputChange}
                      />
                    </Form.Group> */}
                    <div className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Update your password"
                          name="password"
                          value={adminData.password}
                          onChange={handleInputChange}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-secondary"
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
                    </div>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        rows={3}
                        name="phone"
                        value={adminData.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <Select
                        name="role"
                        isSearchable={true}
                        value={{ value: adminData.role, label: adminData.role }}
                        onChange={handleSelectChange}
                        options={[
                          { value: "Admin", label: "Admin" },
                          { value: "Lead", label: "Lead" },
                          { value: "Owner", label: "Owner" },
                          { value: "User", label: "User" },
                        ]}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={adminData.title}
                        placeholder="Intern, Software Engineer, Senior Executive, Engineer, Director"
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
                                  {[9].includes(columnIndex) &&
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
                        {page.map((row, rowIndex) => {
                          prepareRow(row);
                          const sNo = rowIndex + 1 + pageIndex * pageSize; // Calculate S.No

                          return (
                            <tr
                              className="table-active"
                              {...row.getRowProps()}
                              key={row.id || rowIndex} // Use row.id if available, otherwise use rowIndex
                            >
                              {row.cells.map((cell, cellIndex) => (
                                <td
                                  {...cell.getCellProps()}
                                  className="cell-style"
                                  key={cell.id}
                                >
                                  {cellIndex === 0 ? (
                                    <span className="sno-style">{sNo}</span>
                                  ) : cellIndex === 2 ? (
                                    <>
                                      <div className="d-flex align-items-center gap-2">
                                        <Avatar
                                          img={
                                            row.original.profileImage
                                              ? row.original.profileImage
                                              : dummyImage
                                          }
                                          // height="35px"
                                          // width="35px"
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
                <Footer />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminAdminManagement;

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

// function formatDate(inputDate) {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const parts = inputDate.split("-");
//   if (parts.length === 3) {
//     const year = parts[0].slice(2); // Get the last two digits of the year
//     const month = months[parseInt(parts[1], 10) - 1]; // Adjust month to be zero-based
//     const day = parts[2];

//     return `${day} ${month}, ${year}`;
//   }

//   return inputDate; // Return the input as is if it doesn't match the format
// }

const CustomLastLoginColumn = ({ value }) => {
  const calculateTimeAgo = (timestamp) => {
    if (!timestamp) {
      return "Never logged in";
    }

    const now = new Date();
    const timeDiff = now - new Date(timestamp);
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  const timeSinceLastLogin = calculateTimeAgo(value);

  let cellContent;
  let cellStyle = {};

  if (timeSinceLastLogin === "Never logged in") {
    // User has never logged in
    cellContent = "Never logged in";
  } else if (
    timeSinceLastLogin.includes("second ago") ||
    timeSinceLastLogin.includes("min ago")
  ) {
    // Less than 5 minutes, show green Online
    cellContent = "🟢 Online";
  } else if (timeSinceLastLogin.includes("hour ago")) {
    // Less than an hour, show yellow time ago
    cellContent = "🟡 " + timeSinceLastLogin;
  } else {
    // More than an hour, show red Offline
    cellContent = "🔴 Offline";
    cellStyle = { color: "red" };
  }

  return <div style={{ textAlign: "center", ...cellStyle }}>{cellContent}</div>;
};
