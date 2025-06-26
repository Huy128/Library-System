import React, { useEffect, useState } from "react";
import "./BookList.css";

function BookList({ token }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/books", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setBooks(data))
      .catch(err => {
        console.error("Error fetching books:", err);
        alert("Please login to view books.");
      });
  }, [token]);

  return (
    <div className="booklist-container">
      <h2 className="booklist-header">Available Books</h2>
      <ul className="booklist-ul">
        {books.map(book => (
          <li key={book.id} className="booklist-li">
            <strong>{book.title}</strong> by {book.author} ({book.category})
            {book.available ? " ✅ Available" : " ❌ Borrowed"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
