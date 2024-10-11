import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import ManageBooksPage from './pages/ManageBooksPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Protect the book-related routes with private route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <BookListPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <BookListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <PrivateRoute>
              <BookDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-books"
          element={
            <PrivateRoute requiredRole="Librarian">
              <ManageBooksPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;