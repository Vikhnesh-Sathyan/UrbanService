import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/AdminDashboard.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <section className="admin-users-section">
        <div className="admin-empty-state">
          <h3>Loading users...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-users-section">
      <div className="admin-section-header">
        <div>
          <span className="admin-label">
            USER MANAGEMENT
          </span>

          <h2>All Users</h2>

          <p>
            View and manage registered customers.
          </p>
        </div>

        <span className="booking-count">
          {users.length} users
        </span>
      </div>

      {users.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">👤</div>

          <h3>No Users Found</h3>

          <p>
            Registered customers will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="booking-person">
                      <strong>
                        {user.name || "Unknown"}
                      </strong>

                      <span>
                        {user.email || "-"}
                      </span>
                    </div>
                  </td>

                  <td>
                    {user.phone || "-"}
                  </td>

                  <td>
                    {user.location?.city
                      ? `${user.location.city}${
                          user.location.state
                            ? `, ${user.location.state}`
                            : ""
                        }`
                      : "-"}
                  </td>

                  <td>
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      className="admin-view-btn"
                      onClick={() =>
                        navigate(
                          `/admin/users/${user._id}`
                        )
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminUsers;