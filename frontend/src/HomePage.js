import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

function HomePage({ token, username, onLogout }) {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Lấy danh sách sách
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Tìm kiếm
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/books/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(res.data);
    } catch (error) {
      console.error("Error searching books:", error);
      alert("Search failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  // Mượn sách
  const handleBorrow = async (bookId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/borrow/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Borrowed successfully!");
      fetchBooks(); // refresh lại danh sách
    } catch (error) {
      alert(error.response?.data?.message || "Borrow failed.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="homepage-container">
      <h2 className="homepage-header">Welcome, {username}!</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search books..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          🔍 Search
        </button>
        <button onClick={fetchBooks} className="search-button">
          🔁 Reset
        </button>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => navigate("/my-borrows")}
          className="action-button"
        >
          📚 My Borrowed Books
        </button>

        <button onClick={onLogout} className="action-button logout">
          🚪 Logout
        </button>
      </div>

      <h3>Book List:</h3>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-list-item">
            <strong>{book.title}</strong> - {book.author} - ISBN: {book.isbn} -{" "}
            {book.available ? (
              <button
                onClick={() => handleBorrow(book.id)}
                className="borrow-button"
              >
                Borrow
              </button>
            ) : (
              <span className="not-available">Not available</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
