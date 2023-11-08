import axios from "axios";
import fs from "fs/promises";

const apiUrl = "http://localhost:5000/api/legacy/add";

async function sendData() {
  try {
    const jsonData = await fs.readFile(
      "/home/suhail/newsquad/server/setup/db.json",
      "utf8"
    );
    const projects = JSON.parse(jsonData);

    
    const errorProjects = []; // Array to store objects with errors

    for (const project of projects) {
      try {
        const response = await axios.post(apiUrl, project);
        console.log("Success:", response.data);
      } catch (error) {
        console.error("Error:", error);
        errorProjects.push(project); // Push the object with errors to the array
        await fs.writeFile(
          "error.json",
          JSON.stringify(errorProjects, null, 2),
          "utf8"
        );
      }
    }

    // Write the objects with errors to "error.json" file
  } catch (error) {
    console.error("Error:", error);
  }
}

sendData();
