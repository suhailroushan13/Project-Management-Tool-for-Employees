import axios from "axios";
import config from "../../config.json";
const url = config.URL;

async function getLeads() {
  try {
    // Making the API call with Axios


    const response = await axios.get(`${url}/api/users/getleads`);



    // The response data is already processed as a JavaScript object
    const leadsData = response.data;

    // console.log(leadsData);

    // Transforming the data into the desired format
    const leadArray = leadsData.map((lead) => ({
      value: lead.displayName.toLowerCase().replace(/\s/g, ""), // removes spaces and converts to lowercase
      label: lead.displayName,
    }));

    return leadArray;
  } catch (error) {
    console.error("There was a problem with the axios operation:", error);
  }
}

async function getRest() {
  try {

    const response = await axios.get(`${url}/api/users/getall`);

    const owners = response.data;
    // console.log(owners);

    // Transforming the data into the desired format, excluding admins
    const ownerArray = owners
      .filter((lead) => lead.role !== "Admin") // Filter out users with 'admin' role
      .map((lead) => ({
        value: lead.displayName.toLowerCase().replace(/\s/g, ""), // removes spaces and converts to lowercase
        label: lead.displayName,
      }));
    // console.log(owners);
    return ownerArray;

    // ...
  } catch (error) {
    console.error("There was a problem with the axios operation:", error);
  }
}

export { getLeads, getRest };
