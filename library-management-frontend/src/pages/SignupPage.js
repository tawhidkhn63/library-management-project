import React, { useState } from 'react';
import { signup } from '../api/authService'; // Import the signup service

function SignupPage() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'Customer' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(formData.email, formData.password, formData.role);
      console.log('Signup successful:', data);
      // Redirect to login or dashboard after successful signup
      window.location.href = '/login'; // Or use react-router's `useNavigate`
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Customer">Customer</option>
            <option value="Librarian">Librarian</option>
          </select>
        </div>
        <button type="submit">Signup</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default SignupPage;
