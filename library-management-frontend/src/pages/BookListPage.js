import React, { useState, useEffect } from 'react';
import { getBooks } from '../api/bookService'; 

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filterByAvailability, setFilterByAvailability] = useState('all'); 
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Fetch books when component loads
  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await getBooks(); // Fetch books from your API
        setBooks(data); // Store the fetched books
        setFilteredBooks(data); // Initialize the filtered books with all books
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
    fetchBooks();
  }, []);

  // Filter books based on the search query and availability
  useEffect(() => {
    let filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterByAvailability === 'available') {
      filtered = filtered.filter((book) => !book.isCheckedOut); // Show only available books
    }

    setFilteredBooks(filtered);
  }, [searchQuery, filterByAvailability, books]);

  // Sort books based on selected option
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    let sortedBooks = [...filteredBooks];
    if (selectedOption === 'title') {
      sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedOption === 'author') {
      sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (selectedOption === 'availability') {
      sortedBooks.sort((a, b) => (a.isCheckedOut === b.isCheckedOut ? 0 : a.isCheckedOut ? 1 : -1)); // Sort by availability
    }

    setFilteredBooks(sortedBooks);
  };

  // Handle filter by availability change
  const handleAvailabilityFilterChange = (e) => {
    setFilterByAvailability(e.target.value);
  };

  return (
    <div>
      <h2>Book List</h2>
      <div>
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={sortOption} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="availability">Availability</option>
        </select>
        <select value={filterByAvailability} onChange={handleAvailabilityFilterChange}>
          <option value="all">All Books</option>
          <option value="available">Available Books</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredBooks.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
            <img src={book.coverImage} alt={book.title} style={{ width: '100%' }} />
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>{book.description}</p>
            <p><strong>{book.isCheckedOut ? 'Checked Out' : 'Available'}</strong></p>
            <button onClick={() => window.location.href = `/books/${book.id}`}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookListPage;
