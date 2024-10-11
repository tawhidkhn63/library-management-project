import axios from 'axios';

// Get the token from local storage or any other storage where you saved it after login
const getToken = () => {
  return localStorage.getItem('token'); // Assumes token is stored in localStorage
};

// Get all books
export const getBooks = async () => {
  const token = getToken();
  const response = await axios.get('http://localhost:5260/api/Books', {
    headers: {
      Authorization: `Bearer ${token}` // Add the token in the Authorization header
    }
  });
  return response.data;
};

// Get a single book by ID
export const getBookById = async (id) => {
  const token = getToken();
  const response = await axios.get(`http://localhost:5260/api/Books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Add a new book
export const addBook = async (bookData) => {
    const token = getToken();
    const response = await axios.post('http://localhost:5260/api/Books', bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
};

// Update a book
export const updateBook = async (id, bookData) => {
    const token = getToken();
    const response = await axios.put(`http://localhost:5260/api/Books/${id}`, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
};
  
// Delete a book
export const deleteBook = async (id) => {
    const token = getToken();
    const response = await axios.delete(`http://localhost:5260/api/Books/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
};

// Checkout a book
export const checkoutBook = async (bookId) => {
    const token = getToken();
    const response = await axios.post(`http://localhost:5260/api/Books/${bookId}/checkout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};

// Return a book
export const returnBook = async (bookId) => {
    const token = getToken();
    const response = await axios.post(`http://localhost:5260/api/Books/${bookId}/return`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};