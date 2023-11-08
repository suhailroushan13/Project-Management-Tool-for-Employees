import axios from "axios";
import Prism from "prismjs";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import config from "../config.json";
import Footer from "../layouts/Footer";
import UserProjectHeader from "../layouts/UserProjectHeader";
import "chart.js/auto";

function UserDashboard() {
  const [localData, setLocalData] = useState([]);

  const url = config.URL;

  let findName = localStorage.getItem("user");
  let stringToObject = JSON.parse(findName || "{}"); // added fallback
  let name = stringToObject.name || ""; // added fallback

  useEffect(() => {
    Prism.highlightAll();
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);
  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getall`);
      console.log(response.data);

      setLocalData(
        (prevData) =>
          response.data
            .filter((item) => item.lead === name) // Filter based on the "lead" field
            .sort((a, b) => b.id - a.id) // Sort in descending order based on the "id" field
      );
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
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

  const userStatusCounts = {};
  localData.forEach((project) => {
    const status = project.status;
    if (!userStatusCounts[status]) {
      userStatusCounts[status] = 1;
    } else {
      userStatusCounts[status]++;
    }
  });

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
          <Col xl="8" className="pb-3">
            <Row className="g-3">
              {localData.length > 0 && (
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
              )}
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
                    <td>{project.status}</td>
                    <td>{formatDate(project.newEndDate)}</td>
                    <td>{formatDate(project.nextReview)}</td>
                    {/* Render more project details as needed */}
                  </tr>
                ))}
              </tbody>
            </Table>

            <br />

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
              {/* Render pie charts for different users */}

              <Col>
                <br></br>
                <h2>{name}</h2>
                <Card className="card">
                  <Card.Body>
                    <ReactApexChart
                      series={userValuesArray}
                      options={userOpt}
                      type="pie"
                      width={430}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
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
