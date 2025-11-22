import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../utils/api";

const AdminTherapistManagement = () => {
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      let users = await getAllUsers();
      let filtered = users.filter((u) => u.role === "therapist");
      setTherapists(filtered);
    } catch (err) {
      console.error("Error loading therapists:", err);
    }
  };

  const handlePermission = async (id, value) => {
    if (value === "no") {
      // DELETE USER
      const confirmDelete = window.confirm(
        "Are you sure you want to remove this therapist?"
      );
      if (!confirmDelete) return;

      await deleteUser(id);
      loadTherapists();
    } else {
      alert("Permission granted (YES). Nothing to update.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Therapists</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Keep?</th>
          </tr>
        </thead>

        <tbody>
          {therapists.map((t) => (
            <tr key={t._id}>
              <td>{t.username}</td>
              <td>{t.email}</td>

              <td>
                <select onChange={(e) => handlePermission(t._id, e.target.value)}>
                  <option value="">Select</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTherapistManagement;
