// frontend/src/pages/EmailVerificationPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Paper, CircularProgress, Alert } from '@mui/material';
import Layout from '../components/layout/Layout';
import authService from '../services/authService';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setSuccess(true);
        
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (error) {
        setError(error.response?.data?.message || 'Email verification failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Layout>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Email Verification
        </Typography>
        
        {verifying && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </Box>
        )}
        
        {!verifying && success && (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your email has been successfully verified! You can now log in to your account.
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </Box>
          </>
        )}
        
        {!verifying && error && (
          <>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Layout>
  );
};

export default EmailVerificationPage;