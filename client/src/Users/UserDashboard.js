/* eslint-disable */
import axios from "axios";
import Prism from "prismjs";
import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import Loader from "../Root/Loader.js";
import Shimmer from "../components/Shimmer.js";
import config from "../config.json";
import Footer from "../layouts/Footer";
import UserProjectHeader from "../layouts/UserProjectHeader";
import UserSidebar from "../layouts/UserSideBar";
// import Loader from "../Root/Loader";
import "chart.js/auto";
import ReactApexChart from "react-apexcharts";

function UserDashboard() {
  const [leadData, setLeadData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [localData, setLocalData] = useState([]);
  const [hasReloaded, setHasReloaded] = useState(false);

  const [dataAvailable, setDataAvailable] = useState(false); // Add a flag to track data availability
  const [error, setError] = useState(null); // Add state to track errors
  const url = config.URL;

  const name = JSON.parse(localStorage.getItem("user"))?.name;

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      localStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else {
      // fetchData and fetchAllData should ideally be combined into one function
      fetchData();
      fetchAllData();
    }

    return () => {
      // Reset the flag when the component unmounts or data is successfully loaded
      localStorage.removeItem("hasReloaded");
    };
  }, []); // Empty array to run only on initial mount
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getleadsdata`);
      setLeadData(response.data);
    } catch (error) {
      console.error("Error fetching lead data:", error);
      setError(error); // Set error state
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getall`);
      const sortedData = response.data
        .filter((item) => item.lead === name)
        .sort((a, b) => b.id - a.id);
      setLocalData(sortedData);
      setDataAvailable(sortedData.length > 0); // Update the dataAvailable flag
    } catch (error) {
      console.error("Error fetching all data: ", error);
      setError(error); // Set error state
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

  const specificUserData = extractedData[name];
  const UserValuesArray = specificUserData ? specificUserData.values : [];
  const UserKeysArray = specificUserData ? specificUserData.keys : [];

  const chartWidth = 200;

  const UserOpt = {
    labels: UserKeysArray,
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            width: chartWidth,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const ctxLabel = leadData.map((item) => item[0]);
  const ctxData1 = leadData.map((item) => item[1]);
  const ctxColor1 = "#506fd9";

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
      <UserProjectHeader />
      <div className="main main-app p-3 p-lg-4">
        <div className="md-flex">
          <ol className="breadcrumb fs-sm mb-1">
            <li className="breadcrumb-item">
              <Link to="#">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page"></li>
          </ol>

          {dataAvailable ? (
            <>
              <Col xl="8" className="pb-3">
                <Row className="g-3">
                  <Col xs="6" md={2}>
                    <Card className="card-one w-100">
                      <Card.Body className="p-3">
                        <div className="d-block fs-40 lh-1 text-primary mb-1">
                          <i className="ri-file-list-line"></i>
                        </div>
                        <h1 className="card-value mb-0 ls--1 fs-36">
                          {localData.length}
                        </h1>
                        <label className="d-block mb-1 mt-1 fw-medium text-dark">
                          Total Projects
                        </label>
                      </Card.Body>
                    </Card>
                  </Col>
                  {Completedcount > 0 && (
                    <Col xs="6" sm={2}>
                      <Card className="card-one w-100">
                        <Card.Body className="p-3">
                          <div className="d-block fs-40 lh-1 text-ui-02 mb-1">
                            <i className="ri-check-double-line"></i>
                          </div>
                          <h1 className="card-value mb-0 fs-36 ls--1">
                            {Completedcount}
                          </h1>
                          <label className="d-block mb-1 fw-medium text-dark">
                            Completed Projects
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {onHoldCount > 0 && (
                    <Col sm={2}>
                      <Card className="card-one w-100">
                        <Card.Body className="p-3">
                          <div className="d-block fs-36 lh-1 text-secondary mb-1">
                            <i className="ri-information-line"></i>
                          </div>
                          <h1 className="card-value mb-0 fs-36 ls--1">
                            {onHoldCount}
                          </h1>
                          <label className="d-block mb-1 fw-medium text-dark">
                            On Hold Projects
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {notStarted > 0 && (
                    <Col xs="6" sm={2}>
                      <Card className="card-one w-100">
                        <Card.Body className="p-3">
                          <div className="d-block fs-40 lh-1 text-ui-02 mb-1">
                            <i className="ri-draft-fill"></i>
                          </div>
                          <h1 className="card-value mb-0 fs-36 ls--1">
                            {notStarted}
                          </h1>
                          <label className="d-block mb-1 fw-medium text-dark">
                            Not Started
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {inProgress > 0 && (
                    <Col xs="6" sm={2}>
                      <Card className="card-one w-100">
                        <Card.Body className="p-3">
                          <div className="d-block fs-40 lh-1 text-ui-02 mb-1">
                            <i className="ri-restart-line"></i>
                          </div>
                          <h1 className="card-value mb-0 fs-36 ls--1">
                            {inProgress}
                          </h1>
                          <label className="d-block mb-1 fw-medium text-dark">
                            In Progress
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Col>

              <div className="card border p-3 project-box">
                <h2>Projects of {name}</h2>
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th scope="col">S.NO</th>
                      <th scope="col">Project ID</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Owner</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Status</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Next Review</th>
                      {/* Add more columns as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {localData.map((project, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{project.id}</td>
                        <td>{project.projectName}</td>
                        <td>{project.owner}</td>
                        <td>
                          <Badge
                            bg={badgeClassesForPriority[project.priority]}
                            pill
                          >
                            {project.priority}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={badgeClassesForStatus[project.status]}>
                            {project.status}
                          </Badge>
                        </td>
                        <td>{formatDate(project.newEndDate)}</td>
                        <td>{formatDate(project.nextReview)}</td>
                        {/* Render more project details as needed */}
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Card className="card">
                  <Card.Body>
                    <Bar
                      data={{
                        labels: chartLabels,
                        datasets: [
                          {
                            data: chartData,
                            backgroundColor: "#506fd9",
                            barPercentage: 0.5,
                          },
                        ],
                      }}
                      options={optionBar}
                      height={400}
                      width={170}
                      className="ht-400"
                    />
                  </Card.Body>
                </Card>
              </div>

              <Container>
                <Row>
                  <Col>
                    <h2>{name}</h2>
                    <Card className="card">
                      <Card.Body>
                        <ReactApexChart
                          series={UserValuesArray}
                          options={UserOpt}
                          type="pie"
                          width={430}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </>
          ) : (
            // Display this message when data is not available
            <>
              <center>
                <h1>No Data Available</h1>
              </center>
            </>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default UserDashboard;

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
