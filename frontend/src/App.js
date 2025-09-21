import React, { useState } from "react";
import Login from "./components/Login";
import Notes from "./components/Notes";
import Health from "./components/Health";
import TenantUsers from "./components/TenantsUser";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("notes"); // "notes" | "health" | "users"

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Logout & Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <div>
          <button
            onClick={() => setView("notes")}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: view === "notes" ? "#007bff" : "#f0f0f0",
              color: view === "notes" ? "#fff" : "#000",
            }}
          >
            Notes
          </button>

          <button
            onClick={() => setView("health")}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: view === "health" ? "#007bff" : "#f0f0f0",
              color: view === "health" ? "#fff" : "#000",
            }}
          >
            Health
          </button>
{/* 
          Show Users tab only for Admin  */}
          {user.role === "Admin" && (
            <button
              onClick={() => setView("users")}
              style={{
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: view === "users" ? "#007bff" : "#f0f0f0",
                color: view === "users" ? "#fff" : "#000",
              }}
            >
              Users
            </button>
          )}
        </div>

        <button
          onClick={() => setUser(null)}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Conditional Rendering */}
      <div>
        {view === "notes" && <Notes user={user} />}
        {view === "health" && <Health user={user} />}
        {view === "users" && user.role === "Admin" && <TenantUsers user={user} />}
      </div>
    </div>
  );
}

export default App;
