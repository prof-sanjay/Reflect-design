// fe/src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser } from "../utils/api";
import "../styles/AdminDashboard.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      alert("Failed to load users. Please try again.");
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      loadUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Users Management</h1>

      <div className="users-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email || "N/A"}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleUpdateUserRole(user._id, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="therapist">Therapist</option>
                  </select>
                </td>
                <td>
                  <span className={`risk-badge ${user.riskLevel}`}>
                    {user.riskLevel}
                  </span>
                </td>
                <td>
                  <button className="btn-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
