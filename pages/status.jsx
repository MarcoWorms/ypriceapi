import React, { useState, useEffect } from "react";

const StatusPage = () => {
  const [chains, setChains] = useState({});
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch("https://ypriceapi-beta.yearn.finance/chains");
        const data = await response.json();
        setChains(data);
      } catch (error) {
        console.error("Error fetching chains:", error);
      }
    };

    fetchChains();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      const newStatus = {};

      for (const id of Object.keys(chains)) {
        try {
          const response = await fetch(`https://ypriceapi-beta.yearn.finance/health_check/${id}`);
          const data = await response.text();
          newStatus[id] = data === "true";
        } catch (error) {
          console.error(`Error fetching status for chain ${id}:`, error);
          newStatus[id] = false;
        }
      }

      setStatus(newStatus);
    };

    if (Object.keys(chains).length > 0) {
      fetchStatus();
    }
  }, [chains]);

  return (
    <div style={{ marginLeft: 10 }}>
      <h1>Status Page</h1>
    {Object.entries(chains).map(([id, name]) => (
        <p key={id}>
        {name} ({id}): {status[id] === undefined ? 'Loading...' : status[id] ? <span style={{color: "green", fontWeight: 'bold'}}>Up</span> : <span style={{color: "red", fontWeight: 'bold'}}>Down</span>}
        </p>
    ))}
    </div>
  );
};

export default StatusPage;