import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById, checkoutBook, returnBook } from '../api/bookService'; 
import { getRole } from '../api/authService'; 

const BookDetailsPage = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // State to store book details
  const [role, setRole] = useState(''); // Store the user's role
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the book details when the component mounts
    const fetchBookDetails = async () => {
      try {
        const bookData = await getBookById(id);
        setBook(bookData); // Store the book data in state
        const userRole = getRole(); // Fetch the role from localStorage or API
        setRole(userRole);
      } catch (err) {
        setError('Failed to fetch book details');
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleCheckout = async () => {
    try {
      await checkoutBook(id); // Call the API to checkout the book
      alert('Book checked out successfully!');
      setBook({ ...book, isCheckedOut: true }); // Update the book state
    } catch (err) {
      alert('Failed to checkout the book');
    }
  };

  const handleReturn = async () => {
    try {
      await returnBook(id); // Call the API to return the book
      alert('Book returned successfully!');
      setBook({ ...book, isCheckedOut: false }); // Update the book state
    } catch (err) {
      alert('Failed to return the book');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  // Show loading message until book details are loaded
  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <img src={book.coverImage} alt={book.title} />
      <p>Author: {book.author}</p>
      <p>Description: {book.description}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Publication Date: {new Date(book.publicationDate).toLocaleDateString()}</p>
      <p>Category: {book.category}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Page Count: {book.pageCount}</p>
      <p>Status: {book.isCheckedOut ? 'Checked Out' : 'Available'}</p>

      {/* Display the "Checkout" button if the user is a Customer and the book is available */}
      {role === 'Customer' && !book.isCheckedOut && (
        <button onClick={handleCheckout}>Checkout</button>
      )}

      {/* Display the "Return" button if the user is a Librarian and the book is checked out */}
      {role === 'Librarian' && book.isCheckedOut && (
        <button onClick={handleReturn}>Return Book</button>
      )}
    </div>
  );
};

export default BookDetailsPage;
