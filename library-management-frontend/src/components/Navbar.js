import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authService';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Navbar = () => {
  const role = localStorage.getItem('role'); // Get the user's role
  const token = localStorage.getItem('token'); // Check if the user is logged in
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Library Management
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/books">
            Featured Books
          </Button>
          {token ? (
            <>
              {/* Show "Manage Books" only if the user is a Librarian */}
              {role === 'Librarian' && (
                <Button color="inherit" component={Link} to="/manage-books">
                  Manage Books
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
