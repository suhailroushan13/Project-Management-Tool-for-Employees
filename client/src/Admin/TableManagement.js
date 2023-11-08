// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FaEdit, FaFilter, FaTrashAlt } from "react-icons/fa";
// import { useFilters, useGlobalFilter, useSortBy, useTable } from "react-table";
// import config from "../config.json";
// import "./New.css";

// import {
//   Button,
//   Card,
//   Col,
//   Form,
//   Modal,
//   // Nav,
//   Row,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import Footer from "../layouts/Footer";
// import Header from "../layouts/Header";

// const TableManagement = ({ data }) => {
//   const url = config.PROD_URL;
//   const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
//   const [skin, setSkin] = useState(currentSkin);
//   const [openFilter, setOpenFilter] = useState(null);
//   const dropdownRef = React.useRef(null);
//   const [filterInput, setFilterInput] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [leadId, setLeadId] = useState("");
//   const [ownerId, setOwnerId] = useState("");
//   const [newEndDate, setNewEndDate] = useState("");
//   const [priority, setPriority] = useState("");
//   const [status, setStatus] = useState("");
//   const [nextReview, setNextReview] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [localData, setLocalData] = useState(data);

//   const [taskData, setTaskData] = useState({
//     projectId: "",
//     projectName: "",
//     category: "",
//     description: "",
//     client: "",
//     lead: "",
//     owner: "",
//     actualStartDate: "",
//     actualEndDate: "",
//     newStartDate: "",
//     newEndDate: "",
//     priority: "HIGH",
//     status: "COMPLETED",
//     attentionRequired: "",
//     nextReview: "",
//   });

//   ////////////////////////////////////////////////////////

//   // //////////////////////////////////////////////////////////

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenFilter(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const multiSelectFilterFn = (rows, id, filterValues) => {
//     if (!filterValues.length) {
//       return rows;
//     }
//     return rows.filter((row) => filterValues.includes(row.values[id]));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData({
//       ...taskData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post(`${url}/api/addtask`, {
//         name: taskData.name,
//         description: taskData.description,
//         lead: taskData.lead,
//         owner: taskData.owner,
//         newEndDate: taskData.newEndDate,
//         priority: taskData.priority,
//         status: taskData.status,
//         nextReview: taskData.nextReview,
//       });

//       console.log(response.data);

//       setShowModal(false);
//       setTaskData({
//         name: "",
//         description: "",
//         lead: "",
//         owner: "",
//         newEndDate: "",
//         priority: "HIGH",
//         status: "COMPLETED",
//         nextReview: "",
//       });

//       // fetchData();
//     } catch (error) {
//       console.error("Error creating task: ", error);
//     }
//   };
//   const handleEdit = (item) => {
//     setName(item.name);
//     setDescription(item.description);
//     setLeadId(item.leadName);
//     setOwnerId(item.ownerName);
//     setNewEndDate(item.newEndDate);
//     setPriority(item.priority);
//     setStatus(item.status);
//     setNextReview(item.nextReview);
//     setEditingItem(item);
//     setModalVisible(true);
//   };

//   const handleDelete = (item) => {
//     const updatedData = localData.filter((i) => i !== item);
//     setLocalData(updatedData);
//     // if you want to inform the parent of the deletion, you can do so here.
//   };
//   const DropdownFilter = ({ column }) => {
//     const { filterValue = [], setFilter, preFilteredRows, id } = column;
//     const options = React.useMemo(() => {
//       const values = new Set();
//       preFilteredRows.forEach((row) => {
//         values.add(row.values[id]);
//       });
//       return [...values.values()];
//     }, [id, preFilteredRows]);

//     return (
//       <div className="filter-dropdown">
//         {options.map((option, i) => (
//           <label key={i}>
//             <input
//               type="checkbox"
//               value={option}
//               checked={filterValue.includes(option)}
//               onChange={(e) => {
//                 const checked = e.target.checked;
//                 const newValue = checked
//                   ? [...filterValue, e.target.value]
//                   : filterValue.filter((val) => val !== e.target.value);
//                 setFilter(newValue.length ? newValue : undefined);
//               }}
//             />
//             {option}
//           </label>
//         ))}
//         <button className="clear-filter" onClick={() => setFilter(undefined)}>
//           Clear
//         </button>
//       </div>
//     );
//   };

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Project Name",
//         accessor: "name",
//         width: 50,
//         Filter: DropdownFilter,
//         Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>, // Added this line for left alignment
//       },
//       {
//         Header: "Description",
//         accessor: "description",
//         width: 200,
//         Filter: DropdownFilter,
//         Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>, // Added this line for left alignment
//       },
//       {
//         Header: "Lead Name",
//         accessor: "leadName",
//         Filter: DropdownFilter,
//         filter: multiSelectFilterFn,
//       },
//       {
//         Header: "Owner Name",
//         accessor: "ownerName",
//         Filter: DropdownFilter,
//         filter: multiSelectFilterFn,
//       },
//       {
//         Header: "Due Date",
//         accessor: "newEndDate",
//         Filter: DropdownFilter,
//         filter: multiSelectFilterFn,
//       },
//       {
//         Header: "Priority",
//         accessor: "priority",
//         filter: multiSelectFilterFn,
//         Cell: ({ value }) => {
//           let bgColor, textColor, center, bold;
//           switch (value) {
//             case "HIGH":
//               bgColor = "red";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "MEDIUM":
//               bgColor = "#FFA500";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "LOW":
//               bgColor = "pink";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "NA":
//               bgColor = "green";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             default:
//               bgColor = "white"; // Default background color if none of the above
//           }
//           return (
//             <div
//               style={{
//                 backgroundColor: bgColor,
//                 color: textColor,
//                 fontWeight: bold,
//                 textAlign: center,
//               }}
//             >
//               {value}
//             </div>
//           );
//         },
//         Filter: DropdownFilter,
//         filter: multiSelectFilterFn,
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         filter: multiSelectFilterFn,
//         Cell: ({ value }) => {
//           let bgColor, textColor, center, bold;

//           switch (value) {
//             case "NOT STARTED":
//               bgColor = "red";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "IN PROGRESS":
//               bgColor = "#FFA500";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "ON HOLD":
//               bgColor = "#20B2AA";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "COMPLETED":
//               bgColor = "green";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "TO BE REVIEWED BY CEO":
//               bgColor = "#FF69B4";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             case "READY FOR EXECUTION":
//               bgColor = "#556B2F";
//               textColor = "white";
//               center = "center";
//               bold = "bold";
//               break;
//             default:
//               bgColor = "white"; // Default background color if none of the above
//           }
//           return (
//             <div
//               style={{
//                 backgroundColor: bgColor,
//                 color: textColor,
//                 fontWeight: bold,
//                 textAlign: center,
//               }}
//             >
//               {value}
//             </div>
//           );
//         },
//         Filter: DropdownFilter,
//       },

//       {
//         Header: "Next Review",
//         accessor: "nextReview",
//         Filter: DropdownFilter,
//       },
//       {
//         Header: "Edit/Delete",
//         Filter: DropdownFilter,
//         Cell: ({ row }) => (
//           <div>
//             <button onClick={() => handleEdit(row.original)}>
//               <i className="ri-edit-line"></i>
//             </button>
//             <button onClick={() => handleDelete(row.original)}>
//               <i className="ri-delete-bin-line"></i>
//             </button>
//           </div>
//         ),
//       },
//     ],

//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     setGlobalFilter, // Function to set global filter
//   } = useTable(
//     {
//       columns,
//       data: localData, // use localData here
//     },
//     useFilters,
//     useGlobalFilter, // Use the useGlobalFilter hook
//     useSortBy
//   );
//   const handleFilterChange = (e) => {
//     const value = e.target.value || undefined;
//     setGlobalFilter(value); // Set the global filter
//     setFilterInput(value);
//   };

//   return (
//     <>
//       <React.Fragment>
//         <Header onSkin={setSkin} />
//         <div className="main main-app p-3 p-lg-4">
//           <div className="d-md-flex align-items-center justify-content-between mb-4">
//             <div>
//               <ol className="breadcrumb fs-sm mb-1">
//                 <li className="breadcrumb-item">
//                   <Link to="#">Dashboard</Link>
//                 </li>
//                 <li className="breadcrumb-item active" aria-current="page">
//                   Project Management Tool
//                 </li>
//               </ol>
//               <h4 className="main-title mb-0">Welcome to Dashboard</h4>
//             </div>
//             <div className="d-flex gap-2 mt-3 mt-md-0">
//               <Button
//                 variant="danger"
//                 className="d-flex align-items-center gap-2"
//                 onClick={() => setShowModal(true)}
//               >
//                 <i className="ri-add-line fs-18 lh-1"></i>Add Task
//               </Button>

//               {/* Add Task Modal */}
//               <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Add Task</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <Form>
//                     <Form.Group>
//                       <Form.Label>Project Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         value={taskData.projectId}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Description</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="description"
//                         value={taskData.description}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Lead</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="lead"
//                         value={taskData.lead}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Owner</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="owner"
//                         value={taskData.owner}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Due Date</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="newEndDate"
//                         value={taskData.newEndDate}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Priority</Form.Label>
//                       <Form.Control
//                         as="select"
//                         name="priority"
//                         value={taskData.priority}
//                         onChange={handleInputChange}
//                       ></Form.Control>
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Status</Form.Label>
//                       <Form.Control
//                         as="select"
//                         name="status"
//                         value={taskData.status}
//                         onChange={handleInputChange}
//                       >
//                         <option value="COMPLETED">COMPLETED</option>
//                         <option value="IN PROGRESS">IN PROGRESS</option>
//                         <option value="READY FOR EXECUTION">
//                           READY FOR EXECUTION
//                         </option>
//                         <option value="NOT STARTED">NOT STARTED</option>
//                         <option value="ON HOLD">ON HOLD</option>
//                         <option value="TO BE REVIEWED BY CEO">
//                           TO BE REVIEWED BY CEO
//                         </option>
//                         <option value="OVERDUE">OVERDUE</option>
//                       </Form.Control>
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Next Review</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="nextReview"
//                         value={taskData.nextReview}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                   </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <Button
//                     variant="secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Close
//                   </Button>
//                   <Button variant="primary" onClick={handleSubmit}>
//                     Submit
//                   </Button>
//                 </Modal.Footer>
//               </Modal>

//               {/* Delete Confirmation Modal */}

//               {/* <Modal
//               show={showDeleteModal}
//               onHide={() => setShowDeleteModal(false)}
//             >
//               <Modal.Header closeButton>
//                 <Modal.Title>Confirm Deletion</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 Are you sure you want to delete this project?
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button
//                   variant="secondary"
//                   onClick={() => setShowDeleteModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button variant="danger" onClick={confirmDelete}>
//                   Delete
//                 </Button>
//               </Modal.Footer>
//             </Modal> */}

//               {/* Table Render */}
//             </div>
//           </div>
//           <Row className="g-12">
//             <Col xl="12">
//               <Card className="card-one">
//                 <Card.Body className="overflow px-2 pb-3">
//                   <div className="finance-info p-3 p-xl-4">
//                     <div className="modal-wrapper">
//                       {/* Modal related elements */}
//                     </div>
//                     <div className="input-wrapper">
//                       <input
//                         value={filterInput}
//                         onChange={handleFilterChange}
//                         placeholder={"Search Here Anything From Table... 🔍"}
//                         className="search-input"
//                       />
//                     </div>
//                     <table {...getTableProps()} className="table-style">
//                       <thead>
//                         {headerGroups.map((headerGroup) => (
//                           <React.Fragment key={headerGroup.id}>
//                             <tr {...headerGroup.getHeaderGroupProps()}>
//                               {headerGroup.headers.map((column) => (
//                                 <th
//                                   {...column.getHeaderProps()}
//                                   className="header-style"
//                                   key={column.id}
//                                 >
//                                   <div {...column.getSortByToggleProps()}>
//                                     {column.render("Header")}
//                                     <span>
//                                       {column.isSorted
//                                         ? column.isSortedDesc
//                                           ? " 🔽"
//                                           : " 🔼"
//                                         : ""}
//                                     </span>
//                                     {column.canFilter ? (
//                                       <span
//                                         onClick={() =>
//                                           openFilter === column.id
//                                             ? setOpenFilter(null)
//                                             : setOpenFilter(column.id)
//                                         }
//                                         className="filter-icon"
//                                       >
//                                         <FaFilter />
//                                       </span>
//                                     ) : null}
//                                   </div>
//                                   {openFilter === column.id && (
//                                     <div
//                                       className="dropdown-filter"
//                                       ref={dropdownRef}
//                                     >
//                                       {column.render("Filter")}
//                                     </div>
//                                   )}
//                                 </th>
//                               ))}
//                             </tr>
//                           </React.Fragment>
//                         ))}
//                       </thead>
//                       <tbody {...getTableBodyProps()}>
//                         {rows.map((row) => {
//                           prepareRow(row);
//                           return (
//                             <tr {...row.getRowProps()} key={row.id}>
//                               {row.cells.map((cell) => (
//                                 <td
//                                   {...cell.getCellProps()}
//                                   className="cell-style"
//                                   key={cell.id}
//                                 >
//                                   {cell.render("Cell")}
//                                 </td>
//                               ))}
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>

//                     <Footer />
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </React.Fragment>
//     </>
//   );
// };

// export default TableManagement;
