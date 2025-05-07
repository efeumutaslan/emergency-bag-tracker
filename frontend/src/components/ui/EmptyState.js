// frontend/src/components/ui/EmptyState.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';

const EmptyState = ({ 
  title = 'No items found', 
  message = 'You haven\'t added any items to your emergency bag yet.', 
  actionText = 'Add Item',
  actionLink = '/items/add'
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
      textAlign="center"
      p={3}
    >
      <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to={actionLink}
      >
        {actionText}
      </Button>
    </Box>
  );
};

export default EmptyState;