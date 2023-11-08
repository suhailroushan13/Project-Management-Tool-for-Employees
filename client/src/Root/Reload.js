import React, { useEffect, useState } from "react";

function Reload() {
  useEffect(() => {
    // Set a timeout to perform a hard reload after 1 second
    const reloadTimeout = setTimeout(() => {
      window.location.reload(true);
    }, 1000);

    // Clean up the timeout when the component unmounts
    return () => {
      clearTimeout(reloadTimeout);
    };
  }, []);

  return (
    <div>
      <h1>Page is hard reloading...</h1>
      <p>This page will be reloaded from the server, bypassing the cache.</p>
    </div>
  );
}

function App() {
  const [showReload, setShowReload] = useState(true);

  useEffect(() => {
    // Set showReload to false after 1 second to prevent further rendering
    const hideReloadTimeout = setTimeout(() => {
      setShowReload(false);
    }, 1000);

    return () => {
      clearTimeout(hideReloadTimeout);
    };
  }, []);

  return (
    <div className="App">
      {showReload && <Reload />}
      {/* Your other components */}
    </div>
  );
}

export default App;
