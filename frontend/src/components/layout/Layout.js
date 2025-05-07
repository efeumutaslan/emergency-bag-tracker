// frontend/src/components/layout/Layout.js
import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Header />
      <Container component="main" sx={{ 
        flex: 1, 
        py: 4, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;