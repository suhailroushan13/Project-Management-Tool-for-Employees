import ContentLoader from "react-content-loader";
import React, { useEffect, useState } from "react";

function Loader() {
  const [showNoData, setShowNoData] = useState(false);
  const [hasReloaded, setHasReloaded] = useState(false); // Track whether the page has been reloaded

  useEffect(() => {
    const refreshInterval = 5000; // 2 seconds in milliseconds

    const intervalId = setInterval(() => {
      // Reload the page if it hasn't been reloaded already
      if (!hasReloaded) {
        window.location.reload();
        setHasReloaded(true);
      }
    }, refreshInterval);

    // Set a timeout to show "No data available" after 5 seconds
    const timeoutId = setTimeout(() => {
      setShowNoData(true);
    }, 5000);

    // Clean up the interval and timeout when the component unmounts
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [hasReloaded]);

  return (
    <>
      <ContentLoader
        speed={2}
        width={400}
        height={150}
        viewBox="0 0 400 150"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* Avatar */}
        <circle cx="50" cy="50" r="40" />

        {/* User name and details */}
        <rect x="100" y="30" rx="4" ry="4" width="200" height="15" />
        <rect x="100" y="55" rx="3" ry="3" width="150" height="10" />

        {/* Divider */}
        <rect x="0" y="100" rx="0" ry="0" width="400" height="1" />

        {/* Activity or status */}
        <rect x="10" y="120" rx="3" ry="3" width="50" height="15" />
        <rect x="70" y="120" rx="3" ry="3" width="250" height="10" />

        {/* Random shapes at the end, could mimic buttons or icons */}
        <circle cx="370" cy="125" r="8" />
        <circle cx="390" cy="125" r="8" />
      </ContentLoader>
    </>
  );
}

export default Loader;
