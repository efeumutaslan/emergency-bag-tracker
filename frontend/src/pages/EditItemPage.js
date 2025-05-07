// frontend/src/pages/EditItemPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Button } from '@mui/material';
import Layout from '../components/layout/Layout';
import ItemForm from '../components/forms/ItemForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import itemService from '../services/itemService';

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await itemService.getItem(id);
        setItem(data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading item details..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            onClick={() => navigate('/items')} 
            variant="contained" 
            color="primary"
          >
            Back to Items
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Item
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Update the details of {item.name}
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <ItemForm initialValues={item} isEditing={true} />
      </Paper>
    </Layout>
  );
};

export default EditItemPage;