function getLastActive(updatedTime) {
  const currentTime = new Date();
  const updatedDate = new Date(updatedTime);
  const diffInSeconds = (currentTime - updatedDate) / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (diffInDays > 30) {
    return "Suspended";
  } else if (diffInDays >= 1) {
    const days = Math.floor(diffInDays);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInHours >= 1) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes >= 1) {
    const minutes = Math.floor(diffInMinutes);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
}

// Usage:
const updatedTime = "2024-12-18T10:00:00Z"; // Example timestamp in ISO 8601 format
console.log(getLastActive(updatedTime));
