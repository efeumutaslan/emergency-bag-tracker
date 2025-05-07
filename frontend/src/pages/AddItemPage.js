// frontend/src/pages/AddItemPage.js
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import Layout from '../components/layout/Layout';
import ItemForm from '../components/forms/ItemForm';

const AddItemPage = () => {
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Item
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Add details about an item in your emergency kit.
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <ItemForm />
      </Paper>
    </Layout>
  );
};

export default AddItemPage;