import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminBookManager.css";

function AdminBookManager({ token }) {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
  });

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAddBook = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/books",
        {
          ...newBook,
          available: true, // Tự động set sách là available
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewBook({ title: "", author: "", isbn: "", category: "" });
      fetchBooks();
    } catch (err) {
      alert("Failed to add book");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="admin-bookmanager-container">
      <h2>📘 Manage Books</h2>

      <button onClick={() => navigate("/admin")} className="admin-bookmanager-back-button">
        ⬅ Back to Dashboard
      </button>

      <div className="admin-bookmanager-inputs">
        <input
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleInputChange}
        />
        <input
          name="author"
          placeholder="Author"
          value={newBook.author}
          onChange={handleInputChange}
        />
        <input
          name="isbn"
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={handleInputChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={newBook.category}
          onChange={handleInputChange}
        />
        <button onClick={handleAddBook} className="admin-bookmanager-add-button">➕ Add Book</button>
      </div>

      <ul className="admin-bookmanager-ul">
        {books.map((book) => (
          <li key={book.id} className="admin-bookmanager-li">
            <strong>{book.title}</strong> - {book.author} - ISBN: {book.isbn} - {book.category}
            <button
              onClick={() => handleDelete(book.id)}
              className="admin-bookmanager-delete-button"
            >
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminBookManager;
