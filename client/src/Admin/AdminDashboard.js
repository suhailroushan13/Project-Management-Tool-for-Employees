import axios from "axios";
import Prism from "prismjs";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import config from "../config.json";
import Footer from "../layouts/Footer";
import AdminProjectHeader from "../layouts/AdminProjectHeader";
// import "./Dashboard.css";
import Loader from "../Root/Loader"; // Correct path

import "chart.js/auto";

// import "./dashboard.css";

function AdminDashboard() {
  const [leadData, setLeadData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [data, setData] = useState(null);

  const url = config.URL;

  useEffect(() => {
    // Moved Prism.highlightAll   () outside of the axios request since it's not related to the data fetching.
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

  useEffect(() => {
    fetchData().then((fetchedData) => {
      setData(fetchedData);
    });
  }, []);

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

  const legendFontStyle = {
    fontFamily: '"Open Sans", sans-serif', // Use Open Sans as the primary font, fallback to sans-serif if it's not available
    fontSize: "16px", // A legible font size for legends
    fontWeight: "normal", // You can use 'normal' or 'bold' based on your preference
  };

  const AnandOpt = {
    labels: AnandKeysArray,
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
    legend: {
      fontFamily: legendFontStyle.fontFamily,
      fontSize: legendFontStyle.fontSize,
    },
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,
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
    legend: {
      fontFamily: legendFontStyle.fontFamily,
      fontSize: legendFontStyle.fontSize,
    },
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,
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
    legend: {
      fontFamily: legendFontStyle.fontFamily,
      fontSize: legendFontStyle.fontSize,
    },
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,
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
    legend: {
      fontFamily: legendFontStyle.fontFamily,
      fontSize: legendFontStyle.fontSize,
    },
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,
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
    legend: {
      fontFamily: legendFontStyle.fontFamily,
      fontSize: legendFontStyle.fontSize,
    },
    responsive: [
      {
        breakpoint: 100,
        options: {
          chart: {
            height: chartHeight,
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
    legend: {
      fontFamily: legendFontStyle.fontFamily,
      fontSize: legendFontStyle.fontSize,
    },
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
      <AdminProjectHeader />
      <div className="main main-app p-3 p-lg-4">
        <div className="md-flex">
          <ol className="breadcrumb fs-sm mb-1">
            <li className="breadcrumb-item">
              <Link to="#">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page"></li>
          </ol>
          <Col xl="12" className="col-12 pb-3">
            <Row className="g-6 g-md-3 g-lg-2 justify-content-between">
              {renderCard(localData.length, "ri-file-list-line", "Total")}
              {renderCard(Completedcount, "ri-check-double-line", "Completed")}
              {renderCard(onHoldCount, "ri-information-line", "On Hold")}
              {renderCard(notStarted, "ri-draft-fill", "Not Started")}
              {renderCard(inProgress, "ri-restart-line", "In Progress")}
            </Row>
          </Col>
          <div className="card border p-3 project-box">
            <h2>Total Projects Alive</h2>
            {/* <Table striped hover responsive className="mb-0">
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
            </Table> */}
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
              {renderPieChart("Anand", AnandValuesArray, AnandOpt)}
              {renderPieChart("Meera", MeeraValuesArray, MeeraOpt)}
              {renderPieChart("Sanjay", SanjayValuesArray, SanjayOpt)}
              {renderPieChart("Veera", VeeraValuesArray, VeeraOpt)}
              {renderPieChart("Raj", RajValuesArray, RajOpt)}
              {renderPieChart("Firoz", FirozValuesArray, FirozOpt)}
            </Row>
          </Container>
          <Footer />
        </div>
      </div>
    </>
  );

  function renderCard(count, icon, label) {
    return (
      <Col xs="12" sm="2">
        <Card className="card-one w-100">
          <Card.Body className="p-3">
            <div className="d-block fs-40 lh-1 text-primary mb-1">
              <i className={icon}></i>
            </div>
            <h1 className="card-value mb-0 ls--1 fs-36">{count}</h1>
            <label className="d-block mb-1 fw-medium text-dark">{label}</label>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  function renderPieChart(name, valuesArray, opt) {
    return (
      <Col>
        <br />
        <Card className="card">
          <Card.Body>
            <center>
              <h2>{name}</h2>
            </center>
            <ReactApexChart
              series={valuesArray}
              options={opt}
              type="pie"
              width={430}
            />
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

export default AdminDashboard;
