import axios from "axios";
import fs from "fs/promises";

const apiUrl = "https://work.tworks.in/api/projects/add";

async function sendData() {
  try {
    const jsonData = await fs.readFile(
      "/home/suhail/Cloud-Squad/server/setup/db.json",
      "utf8"
    );
    const projects = JSON.parse(jsonData);

    const errorProjects = []; // Array to store objects with errors

    async function sendProjectWithDelay(project) {
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

    for (const project of projects) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for 500 milliseconds
      await sendProjectWithDelay(project);
    }

    // Write the objects with errors to "error.json" file
  } catch (error) {
    console.error("Error:", error);
  }
}

sendData();
