import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyBorrowedBooks.css";

function MyBorrowedBooks({ token }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  const fetchMyBorrows = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/borrow/my-borrows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBorrowedBooks(res.data);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/borrow/return/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Returned successfully!");
      fetchMyBorrows(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Return failed.");
    }
  };

  useEffect(() => {
    fetchMyBorrows();
  }, []);

  return (
    <div className="myborrowedbooks-container">
      <h2 className="myborrowedbooks-header">📚 My Borrowed Books</h2>

      <button onClick={() => navigate("/home")} className="back-button">
        ⬅ Back to Home
      </button>

      {borrowedBooks.length === 0 ? (
        <p>You have no active borrowed books.</p>
      ) : (
        <ul className="borrowed-list">
          {borrowedBooks.map((record) => (
            <li key={record.id} className="borrowed-list-item">
              <strong>{record.book.title}</strong> - Borrowed on:{" "}
              {record.borrowDate} - Due: {record.dueDate}{" "}
              <button
                onClick={() => handleReturn(record.book.id)}
                className="return-button"
              >
                Return
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyBorrowedBooks;
