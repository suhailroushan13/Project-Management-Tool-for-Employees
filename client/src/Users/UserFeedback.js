import { useEffect } from "react";

function UserFeedback() {
  useEffect(() => {
    // Redirect after a short delay to show the message
    window.open("https://forms.gle/77TomY2wKHGw3o6i7", "_blank");
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Render a message that indicates redirection
  return null;
}

export default UserFeedback;
