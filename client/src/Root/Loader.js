import ContentLoader from "react-content-loader";
import React, { useEffect, useState } from "react";

function Loader() {
  const [showNoData, setShowNoData] = useState(false);
  const [hasReloaded, setHasReloaded] = useState(false); // Track whether the page has been reloaded

  useEffect(() => {
    const refreshInterval = 1000; // 2 seconds in milliseconds

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
        width={720} // Total width to accommodate 6 cards (120 * 6)
        height={196} // Height of each card
        viewBox="0 0 720 196" // Adjusted viewBox
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* Loop to create 6 cards */}
        {[...Array(6).keys()].map((i) => (
          <React.Fragment key={i}>
            {/* Each card */}
            <rect
              x={10 + 120 * i}
              y="10"
              rx="4"
              ry="4"
              width="100"
              height="176"
            />

            {/* Optional: Additional elements inside each card, like title or buttons */}
            <circle cx={25 + 120 * i} cy="30" r="8" />
            <rect
              x={45 + 120 * i}
              y="25"
              rx="3"
              ry="3"
              width="50"
              height="10"
            />
            <rect
              x={25 + 120 * i}
              y="50"
              rx="2"
              ry="2"
              width="70"
              height="10"
            />
            <rect
              x={25 + 120 * i}
              y="70"
              rx="2"
              ry="2"
              width="70"
              height="10"
            />
            <rect
              x={25 + 120 * i}
              y="90"
              rx="2"
              ry="2"
              width="70"
              height="10"
            />
            {/* Add more elements as needed */}
          </React.Fragment>
        ))}
      </ContentLoader>
    </>
  );
}

export default Loader;
