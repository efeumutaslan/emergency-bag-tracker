// frontend/src/components/ui/AlertBanner.js
import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AlertBanner = ({ alertItems }) => {
  if (!alertItems || alertItems.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Alert severity="warning">
        <AlertTitle>
          {alertItems.length} {alertItems.length === 1 ? 'item' : 'items'} expiring soon
        </AlertTitle>
        You have {alertItems.length} {alertItems.length === 1 ? 'item' : 'items'} expiring in the next 30 days.
        <Button 
          component={RouterLink} 
          to="/items"
          variant="outlined" 
          size="small" 
          color="inherit" 
          sx={{ ml: 2 }}
        >
          View Items
        </Button>
      </Alert>
    </Box>
  );
};

export default AlertBanner;