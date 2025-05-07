// frontend/src/components/layout/Header.js
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
    handleMobileMenuClose();
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
    handleMobileMenuClose();
  };
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', flexGrow: 1 }}>
          Emergency Bag Tracker
        </Typography>
        
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileAnchorEl}
              keepMounted
              open={Boolean(mobileAnchorEl)}
              onClose={handleMobileMenuClose}
            >
              {isAuthenticated ? (
                <>
                  <MenuItem component={RouterLink} to="/dashboard" onClick={handleMobileMenuClose}>
                    Dashboard
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/items" onClick={handleMobileMenuClose}>
                    My Items
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/recommendations" onClick={handleMobileMenuClose}>
                    Recommendations
                  </MenuItem>
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem component={RouterLink} to="/login" onClick={handleMobileMenuClose}>
                    Login
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/register" onClick={handleMobileMenuClose}>
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box display="flex" alignItems="center">
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/items">
                  My Items
                </Button>
                <Button color="inherit" component={RouterLink} to="/recommendations">
                  Recommendations
                </Button>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  {user?.firstName ? (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user.firstName.charAt(0)}
                    </Avatar>
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;