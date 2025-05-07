// frontend/src/components/auth/ForgotPasswordForm.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Paper,
  Alert
} from '@mui/material';
import authService from '../../services/authService';
import LoadingSpinner from '../ui/LoadingSpinner';

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');

      try {
        await authService.forgotPassword(values.email);
        setSuccess(true);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  if (loading) {
    return <LoadingSpinner message="Sending reset instructions..." />;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Forgot Password
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success ? (
        <>
          <Alert severity="success" sx={{ mb: 3 }}>
            Password reset instructions have been sent to your email address.
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
            >
              Return to Login
            </Button>
          </Box>
        </>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Typography variant="body2" color="textSecondary" paragraph>
            Enter your email address below and we'll send you instructions to reset your password.
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Instructions
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Back to Login
            </Link>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ForgotPasswordForm;