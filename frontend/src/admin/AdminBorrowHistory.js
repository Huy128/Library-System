import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminBorrowHistory.css";

function AdminBorrowHistory({ token }) {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/borrow/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching history:", error);
      alert("Failed to fetch borrow history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="admin-borrowhistory-container">
      <h2>📖 Borrow History</h2>

      <button onClick={() => navigate("/admin")} className="admin-borrowhistory-back-button">
        ⬅ Back to Dashboard
      </button>

      {records.length === 0 ? (
        <p>No borrow history found.</p>
      ) : (
        <table className="admin-borrowhistory-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Returned</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.user?.username}</td>
                <td>{record.book?.title}</td>
                <td>{record.borrowDate}</td>
                <td>{record.dueDate}</td>
                <td>{record.returned ? "✅ Yes" : "❌ No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminBorrowHistory;
