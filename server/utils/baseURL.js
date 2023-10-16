import config from "config";

let URL = config.get("URL");

// Split the URL by "//" to separate the protocol from the rest
const parts = URL.split("//");

// Initialize baseUrl as an empty string (default if URL is invalid)
let baseUrl = "";

// Check if there is a valid protocol (http or https)
if (parts.length === 2 && (parts[0] === "http:" || parts[0] === "https:")) {
  // Get the base URL without the protocol
  baseUrl = parts[1];
} else {
  console.log("Invalid URL");
}

export default baseUrl;
