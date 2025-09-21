import React, { useEffect, useState } from "react";
import axios from "axios";

function Health({ user }) {
  const [tenant, setTenant] = useState({});
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/health`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.data.success) {
        setTenant(res.data.body.tenant);
        setNotesCount(res.data.body.notesCount);
      }
    } catch (err) {
      console.error("Error fetching health data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading health data...</p>;

  const freeLimit = 3;
  const usagePercent =
    tenant.plan === "free"
      ? Math.min((notesCount / freeLimit) * 100, 100)
      : 100;

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", textAlign: "center" }}>
      <h2>Tenant Health</h2>
      <p>Tenant: <b>{tenant.name}</b></p>
      <p>Plan: <b>{tenant.plan}</b></p>

      {tenant.plan === "free" && (
        <div style={{ marginTop: "20px" }}>
          <p>Notes used: {notesCount} / {freeLimit}</p>
          <div style={{ background: "#ddd", height: "20px", borderRadius: "5px" }}>
            <div
              style={{
                width: `${usagePercent}%`,
                background: usagePercent < 100 ? "green" : "red",
                height: "100%",
                borderRadius: "5px",
              }}
            />
          </div>
          {usagePercent >= 100 && (
            <p style={{ color: "red", marginTop: "5px" }}>
              Free plan limit reached! Upgrade to Pro.
            </p>
          )}
        </div>
      )}

      {tenant.plan === "pro" && (
        <p style={{ color: "green", marginTop: "10px" }}>
          ✅ You have unlimited notes.
        </p>
      )}
    </div>
  );
}

export default Health;
