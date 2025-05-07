// frontend/src/pages/ProfilePage.js
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import Layout from '../components/layout/Layout';
import ProfileForm from '../components/forms/ProfileForm';

const ProfilePage = () => {
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Update your personal information and notification preferences.
        </Typography>
      </Box>
      
      <ProfileForm />
    </Layout>
  );
};

export default ProfilePage;