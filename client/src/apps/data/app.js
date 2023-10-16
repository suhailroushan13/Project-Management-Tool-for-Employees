// import axios from "axios";
import fs from "fs/promises"; // Import the 'fs' module for reading files (Node.js built-in module)

// Define the API endpoint
// const apiUrl = "http://172.16.2.110:5000/api/projects/addproject";

// Create an async function to read and send JSON data
async function sendData() {
  try {
    // Read the JSON data from the file 'project.json'
    const jsonData = await fs.readFile("./users.json", "utf8");
    const projects = JSON.parse(jsonData);

    // Loop through each project and make a POST request with Axios
    for (const project of projects) {
      console.log(project);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the async function to read and send the JSON data
sendData();
