// frontend/src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Grid,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

const steps = ['Account Details', 'Personal Information'];

const RegisterForm = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const validationSchema = [
    Yup.object({
      email: Yup.string()
        .email('Enter a valid email')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    }),
    Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      height: Yup.number().min(0, 'Height cannot be negative'),
      weight: Yup.number().min(0, 'Weight cannot be negative')
    })
  ];

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      height: '',
      weight: ''
    },
    validationSchema: validationSchema[activeStep],
    onSubmit: async (values) => {
      if (activeStep === 0) {
        // Move to the next step
        setActiveStep(1);
      } else {
        // Submit the form
        setLoading(true);
        setRegisterError('');
        clearError();

        try {
          // Remove confirmPassword before sending to API
          const { confirmPassword, ...registrationData } = values;
          await register(registrationData);
          
          setSuccess(true);
          
          // Redirect to login after showing success message for a short time
          setTimeout(() => {
            navigate('/login');
          }, 5000);
          
        } catch (error) {
          setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }
  });

  const handleBack = () => {
    setActiveStep(0);
  };

  if (loading) {
    return <LoadingSpinner message="Creating your account..." />;
  }

  if (success) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Registration successful! Please check your email to verify your account. You will be redirected to the login page in a few seconds.
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
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Create an Account
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {(registerError || error) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {registerError || error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        {activeStep === 0 ? (
          // Step 1: Account Details
          <>
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
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </>
        ) : (
          // Step 2: Personal Information
          <>
            <TextField
              margin="normal"
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
            <TextField
              margin="normal"
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
            <TextField
              margin="normal"
              fullWidth
              id="height"
              label="Height (cm) - Optional"
              name="height"
              type="number"
              value={formik.values.height}
              onChange={formik.handleChange}
              error={formik.touched.height && Boolean(formik.errors.height)}
              helperText={formik.touched.height && formik.errors.height}
            />
            <TextField
              margin="normal"
              fullWidth
              id="weight"
              label="Weight (kg) - Optional"
              name="weight"
              type="number"
              value={formik.values.weight}
              onChange={formik.handleChange}
              error={formik.touched.weight && Boolean(formik.errors.weight)}
              helperText={formik.touched.weight && formik.errors.weight}
            />
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {activeStep === 1 && (
            <Button onClick={handleBack} color="inherit">
              Back
            </Button>
          )}
          <Button
            type="submit"
            fullWidth={activeStep === 0}
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, ml: activeStep === 1 ? 1 : 0 }}
          >
            {activeStep === 0 ? 'Continue' : 'Register'}
          </Button>
        </Box>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Log in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RegisterForm;