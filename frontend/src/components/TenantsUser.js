import React, { useEffect, useState } from "react";
import axios from "axios";

function TenantUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invite form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchTenantUsers();
    }
  }, [user]);

  const fetchTenantUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.data.success) {
        setUsers(res.data.body);
      } else {
        setError(res.data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/tenant/${user.tenantId}/users`,
        { email, password, role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (res.data.success) {
        alert("User invited successfully");
        setEmail("");
        setPassword("");
        setRole("Member");
        fetchTenantUsers(); // refresh list
      } else {
        alert(res.data.message || "Failed to invite user");
      }
    } catch (err) {
      alert("Error inviting user");
    }
  };

  const toggleUserPlan = async (userId, currentPlan) => {
    try {
      const newPlan = currentPlan === "free" ? "pro" : "free";

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/tenant/${user.tenantId}/upgrade/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, plan: newPlan } : u))
        );
      } else {
        alert(res.data.message || "Plan update failed");
      }
    } catch (err) {
      alert("Plan update failed");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      <h2>Tenant Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Invite Form */}
      {user.role === "Admin" && (
        <div style={{ marginBottom: "20px" }}>
          <h4>Invite New User</h4>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginRight: "5px" }}>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          <button onClick={inviteUser}>Invite</button>
        </div>
      )}

      {/* Users Table */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const userPlan = u.plan || "free";
              return (
                <tr key={u._id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{userPlan}</td>
                  <td>
                    {user.role === "Admin" && (
                      <button
                        onClick={() => toggleUserPlan(u._id, userPlan)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: userPlan === "free" ? "green" : "orange",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {userPlan === "free" ? "Upgrade to Pro" : "Downgrade to Free"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TenantUsers;
