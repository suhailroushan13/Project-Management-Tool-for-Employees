import axios from "axios";
import fs from "fs/promises";

const apiUrl = "http://localhost:5000/api/users/add";

async function sendData() {
  try {
    // const jsonData = await fs.readFile(
    //   "/home/suhail/newsquad/server/setup/user.json",
    //   "utf8"
    // );

    const jsonData = [
      {
        username: "anand",
        email: "anand@tworks.in",
        password: "anand@tworks.in",
        phone: "+919618211626",
        firstName: "Anand",
        lastName: "Rajagopalan",
        role: "lead",
      },
      {
        username: "meera",
        email: "meera@tworks.in",
        password: "meera@tworks.in",
        phone: "+919618211625",
        firstName: "Mohammad Mohiddin",
        lastName: "Meera",
        role: "lead",
      },
      {
        username: "veera",
        email: "veera@tworks.in",
        password: "veera@tworks.in",
        phone: "+919618211620",
        firstName: "Veera",
        lastName: "Chappi",
        role: "lead",
      },
      {
        username: "sanjay",
        email: "sanjay@tworks.in",
        password: "sanjay@tworks.in",
        phone: "+919618211621",
        firstName: "Sanjay",
        lastName: "Gajjala Kumar",
        role: "lead",
      },
      {
        username: "firoz",
        email: "firoz@tworks.in",
        password: "firoz@tworks.in",
        phone: "+919618211627",
        firstName: "Firoz",
        lastName: "Ahammad",
        role: "lead",
      },
      {
        username: "rajshekhar",
        email: "rajshekhar@tworks.in",
        password: "rajshekhar@tworks.in",
        phone: "+919618211622",
        firstName: "Raj",
        lastName: "Shekhar",
        role: "lead",
      },
    ];

    const projects = jsonData;
    // console.log(projects);

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
