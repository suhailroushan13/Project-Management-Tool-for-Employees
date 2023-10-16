import axios from "axios";
import Prism from "prismjs";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import config from "../config.json";
import Footer from "../layouts/Footer";
import ProjectHeader from "../layouts/ProjectHeader";
// import "./Dashboard.css";
import "chart.js/auto";

// import "./dashboard.css";

function Dashboard() {
  const [leadData, setLeadData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const url = config.PROD_URL;

  useEffect(() => {
    // Moved Prism.highlightAll() outside of the axios request since it's not related to the data fetching.
    Prism.highlightAll();
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getleadsdata`);
      // Assuming the response contains an array of lead data,set it in the state.
      setLeadData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(leadData);

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/getall`);
      console.log(response.data);
      // Sort the array in descending order based on the "id" field
      const sortedData = response.data.sort((a, b) => b.id - a.id);

      setLocalData(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);

  const Completedcount = localData.filter(
    (project) => project.status === "COMPLETED"
  ).length;
  const onHoldCount = localData.filter(
    (project) => project.status === "ON HOLD"
  ).length;
  // setCompletedProjectsCount(Completedcount);
  console.log(Completedcount);

  // console.log(localData);

  function segregateStatusByLead(projects) {
    const leadStatusCounts = {};

    localData.forEach((project) => {
      const lead = project.lead;
      const status = project.status;

      // Initialize if the lead doesn't exist in our tracking object
      if (!leadStatusCounts[lead]) {
        leadStatusCounts[lead] = {};
      }

      // Increment the status count for the lead
      if (!leadStatusCounts[lead][status]) {
        leadStatusCounts[lead][status] = 1;
      } else {
        leadStatusCounts[lead][status]++;
      }
    });

    return leadStatusCounts;
  }

  const segregated = segregateStatusByLead(localData);
  console.log(segregated);

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

  const AnandValuesArray = extractedData?.Anand?.values || [];

  const FirozValuesArray = extractedData?.Firoz?.values || [];

  const MeeraValuesArray = extractedData?.Meera?.values || [];

  const RajValuesArray = extractedData?.Raj?.values || [];

  const SanjayValuesArray = extractedData?.Sanjay?.values || [];

  const VeeraValuesArray = extractedData?.Veera?.values || [];

  const AnandKeysArray = extractedData?.Anand?.keys || [];

  const FirozKeysArray = extractedData?.Firoz?.keys || [];

  const MeeraKeysArray = extractedData?.Meera?.keys || [];

  const RajKeysArray = extractedData?.Raj?.keys || [];

  const SanjayKeysArray = extractedData?.Sanjay?.keys || [];

  const VeeraKeysArray = extractedData?.Veera?.keys || [];

  // /////////////////////////////////////

  // Define a constant width for all the options
  const chartWidth = 200;
  const chartHeight = 200;

  const AnandOpt = {
    labels: AnandKeysArray,
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

  const FirozOpt = {
    labels: FirozKeysArray,
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

  const MeeraOpt = {
    labels: MeeraKeysArray,
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,

            width: chartWidth,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const RajOpt = {
    labels: RajKeysArray,
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,

            width: chartWidth,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const SanjayOpt = {
    labels: SanjayKeysArray,
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,

            width: chartWidth,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const VeeraOpt = {
    labels: VeeraKeysArray,
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,

            width: chartWidth,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  //////////////////////////////////////

  const ctxLabel = leadData.map((item) => item[0]);
  const ctxData1 = leadData.map((item) => item[1]);
  const ctxColor1 = "#506fd9";

  const dataBar = {
    labels: ctxLabel,
    datasets: [
      {
        data: ctxData1,
        backgroundColor: ctxColor1,
        barPercentage: 0.5,
      },
    ],
  };
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
          text: "Leads", // Replace with your desired label for the X-axis
        },
      },
      y: {
        beginAtZero: true,
        max: 50,
        title: {
          display: true,
          text: "Projects", // Replace with your desired label for the Y-axis
        },
      },
    },
  };

  return (
    <>
      <ProjectHeader />
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
              <Col xs="6" md={4}>
                <Card className="card-one w-100">
                  <Card.Body className="p-3">
                    <div className="d-block fs-40 lh-1 text-primary mb-1">
                      <i className="ri-calendar-todo-line"></i>
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
              <Col xs="6" sm={4}>
                <Card className="card-one w-100">
                  <Card.Body className="p-3">
                    <div className="d-block fs-40 lh-1 text-ui-02 mb-1">
                      <i className="ri-calendar-check-line"></i>
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
              <Col sm={4}>
                <Card className="card-one w-100">
                  <Card.Body className="p-3">
                    <div className="d-block fs-36 lh-1 text-secondary mb-1">
                      <i className="ri-calendar-2-line"></i>
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
            </Row>
          </Col>

          <div className="card border p-3 project-box">
            <h2>Projects Alive</h2>
            <Table striped hover responsive className="mb-0">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Leads</th>
                  <th scope="col">Pending Projects</th>
                </tr>
              </thead>
              <tbody>
                {leadData.map(([lead, tasks], index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{lead}</td>
                    <td>{tasks}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <br />

            <Card className="card">
              <Card.Body>
                <Bar
                  data={dataBar}
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
                <h2>Anand</h2>
                <Card className="card">
                  <Card.Body>
                    <ReactApexChart
                      series={AnandValuesArray}
                      options={AnandOpt}
                      type="pie"
                      width={430}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <br></br>
                <h2>Meera</h2>
                <Card className="card">
                  <Card.Body>
                    <ReactApexChart
                      series={MeeraValuesArray}
                      options={MeeraOpt}
                      type="pie"
                      width={430}
                    />
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <br></br>
                <h2>Sanjay</h2>
                <Card className="card">
                  <Card.Body>
                    <ReactApexChart
                      series={SanjayValuesArray}
                      options={SanjayOpt}
                      type="pie"
                      width={500}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <br></br>
                <h2>Veera</h2>
                <Card className="card">
                  <Card.Body>
                    <ReactApexChart
                      series={VeeraValuesArray}
                      options={VeeraOpt}
                      type="pie"
                      width={500}
                    />
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <br></br>
                <h2>Raj</h2>
                <Card className="card">
                  <Card.Body>
                    <ReactApexChart
                      series={RajValuesArray}
                      options={RajOpt}
                      type="pie"
                      width={500}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <br></br>
                <h2>Firoz</h2>
                <Card className="card">
                  <Card.Body>
                    <ReactApexChart
                      series={FirozValuesArray}
                      options={FirozOpt}
                      type="pie"
                      width={500}
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

export default Dashboard;
