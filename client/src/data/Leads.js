import anand from "../assets/users/anand.png";
import firoz from "../assets/users/firoz.jpg";
import meera from "../assets/users/meera.jpg";
import raj from "../assets/users/raj.png";
import sanjay from "../assets/users/sanjay.png";
import dummyImage from "../assets/users/user.png";
import veera from "../assets/users/veera.png";
import nikhila from "../assets/users/nikhila.png";
import suhail from "../assets/users/suhail.png";
import rahman from "../assets/users/rahman.png";
import admin from "../assets/users/user.png";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import Context from "../Root/Context";

const leadsData = [
  {
    id: 0,
    fullName: "Admin",
    name: "Admin",
    path: admin,
    email: "admin@tworks.in",
    role: "Administrator",
  },
  {
    id: 1,
    fullName: "Anand Rajagaopalan",
    firstName: "Anand",
    name: "Anand",
    path: anand,
    email: "anand@tworks.in",
    role: "VP Operations",
  },
  {
    id: 2,
    fullName: "Mohammad Meera Mohiddin",
    firstName: "Meera",
    name: "Meera",
    path: meera,
    email: "meera@tworks.in",
    role: "Director Facilities",
  },
  {
    id: 3,
    fullName: "Firoz Ahammad",
    firstName: "Firoz",
    name: "Firoz",
    path: firoz,
    email: "firoz@tworks.in",
    role: "Admin",
  },
  {
    id: 4,
    fullName: "Raj Shekhar Vadlamani",
    firstName: "Raj",
    name: "Raj",
    path: raj,
    email: "raj@tworks.in",
    role: "Finance Admin",
  },
  {
    id: 5,
    fullName: "Sanjay Gajjala",
    firstName: "Sanjay",
    name: "Sanjay",
    path: sanjay,
    email: "sanjay@tworks.in",
    role: "Director",
  },
  {
    id: 6,
    fullName: "Veerabhadra Rao chappi",
    firstName: "Veera",
    name: "Veera",
    path: veera,
    email: "veera@tworks.in",
    role: "Admin",
  },
  {
    id: 7,
    fullName: "Mohammed Suhail Roushan Ali",
    firstName: "Suhail",
    name: "Suhail",
    path: suhail,
    email: "suhail@tworks.in",
    role: "User",
  },
  {
    id: 8,
    fullName: "Atkuri Sai Nikhila",
    name: "Nikhila",
    path: nikhila,
    email: "sainikhila@tworks.in",
    role: "User",
  },
  {
    id: 9,
    fullName: "Abdur Rahman S",
    name: "Rahman",
    path: rahman,
    email: "rahman@tworks.in",
    role: "User",
  },
];

async function Leads() {
  try {
    const context = useContext(Context);
    const userEmail = context.email;
    // const location = useLocation();
    // const { id } = useParams();

    const response = await axios.get(
      `http://192.168.212.10:5000/api/users/getimage/2`
    );

    console.log(response.data);
    console.log("Hello");

    // // Destructure the required fields from the response
    const { imageUrl, userId, firstName, email, role } = response.data;

    // // Construct the desired format
    const formattedData = {
      id: userId,
      fullName: firstName, // Assuming fullName and firstName are the same here
      name: firstName, // Assuming name and firstName are the same here
      path: imageUrl,
      email: email,
      role: role,
    };

    let leadsData = [formattedData];

    // console.log(leadsData);

    return leadsData;
  } catch (error) {
    console.error("Error fetching the user data:", error);
  }

  return <div>Leads</div>;
}

// let leadsData = [];

export { leadsData, Leads };
