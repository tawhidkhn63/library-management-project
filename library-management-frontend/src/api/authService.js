import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const API_URL = 'http://localhost:5260/api/auth'; // my API URL

// Login API call
export const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token } = response.data;
  
      // Decode the token to extract the user role
      const decodedToken = jwtDecode(token);
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  
      // Save the token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role); // Save the role
  
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
 };

// Signup API call
export const signup = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { email, password, role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

// logout API call
export const logout = () => {
    // Remove the token from localStorage or sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

// check if token expired
export const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      // Decode the token
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp;
  
      // Check if the token is expired
      return Date.now() < exp * 1000; // 'exp' is in seconds, we convert to milliseconds
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
};

// In authService.js
export const getRole = () => {
    return localStorage.getItem('role'); // Assumes the role is stored after login
};
  
