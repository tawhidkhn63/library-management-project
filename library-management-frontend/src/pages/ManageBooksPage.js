import React, { useState, useEffect } from 'react';
import { addBook, updateBook, deleteBook, getBooks } from '../api/bookService';

function ManageBooksPage() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    publisher: '',
    publicationDate: '',
    category: '',
    isbn: '',
    pageCount: ''
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError('Failed to fetch books');
      }
    };

    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBookId) {
        await updateBook(editingBookId, formData);
      } else {
        await addBook(formData);
      }
      setFormData({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        publisher: '',
        publicationDate: '',
        category: '',
        isbn: '',
        pageCount: ''
      });
      setEditingBookId(null);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to save the book');
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setEditingBookId(book.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to delete the book');
    }
  };

  return (
    <div>
      <h2>{editingBookId ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
        <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author" required />
        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
        <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="Cover Image URL" required />
        <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Publisher" required />
        <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} required />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
        <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" required />
        <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} placeholder="Page Count" required />
        <button type="submit">{editingBookId ? 'Update Book' : 'Add Book'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h2>Manage Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageBooksPage;