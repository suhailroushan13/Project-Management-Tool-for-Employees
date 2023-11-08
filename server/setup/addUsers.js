import axios from "axios";
import fs from "fs/promises";
import { setTimeout } from "timers/promises";

const apiUrl = "http://localhost:5000/api/users/add";
const DELAY_BETWEEN_REQUESTS = 500; // Delay of 500ms

async function sendData() {
  try {
    const jsonData = await fs.readFile(
      "/home/suhail/newsquad/server/setup/alluser.json",
      "utf8"
    );
    const projects = JSON.parse(jsonData);

    const errorProjects = []; // Array to store objects with errors

    for (const project of projects) {
      try {
        const response = await axios.post(apiUrl, project);
        console.log("Success:", response.data);

        // Add a delay between requests to prevent overwhelming the server
        // await setTimeout(500);/
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        errorProjects.push(project);
      }
    }

    // Write the objects with errors to "error.json" file, if any
    if (errorProjects.length) {
      await fs.writeFile(
        "error.json",
        JSON.stringify(errorProjects, null, 2),
        "utf8"
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

sendData();
