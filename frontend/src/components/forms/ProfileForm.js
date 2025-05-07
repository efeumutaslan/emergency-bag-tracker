// frontend/src/components/forms/ProfileForm.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProfileForm = () => {
  const { user, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    height: Yup.number().min(0, 'Height cannot be negative'),
    weight: Yup.number().min(0, 'Weight cannot be negative'),
    notificationPreferences: Yup.object({
      expirationAlerts: Yup.boolean(),
      emailFrequency: Yup.string().oneOf(['daily', 'weekly', 'monthly'])
    })
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      height: user?.height || '',
      weight: user?.weight || '',
      notificationPreferences: {
        expirationAlerts: user?.notificationPreferences?.expirationAlerts !== false,
        emailFrequency: user?.notificationPreferences?.emailFrequency || 'weekly'
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const updatedUser = await userService.updateProfile(values);
        updateUser(updatedUser);
        enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || 'Something went wrong', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
  });

  if (loading) {
    return <LoadingSpinner message="Updating profile..." />;
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="height"
              name="height"
              label="Height (cm)"
              type="number"
              value={formik.values.height}
              onChange={formik.handleChange}
              error={formik.touched.height && Boolean(formik.errors.height)}
              helperText={formik.touched.height && formik.errors.height}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="weight"
              name="weight"
              label="Weight (kg)"
              type="number"
              value={formik.values.weight}
              onChange={formik.handleChange}
              error={formik.touched.weight && Boolean(formik.errors.weight)}
              helperText={formik.touched.weight && formik.errors.weight}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.notificationPreferences.expirationAlerts}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'notificationPreferences.expirationAlerts',
                      e.target.checked
                    )
                  }
                  name="notificationPreferences.expirationAlerts"
                  color="primary"
                />
              }
              label="Receive expiration alerts via email"
            />
          </Grid>
          
          {formik.values.notificationPreferences.expirationAlerts && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="email-frequency-label">Email Frequency</InputLabel>
                <Select
                  labelId="email-frequency-label"
                  id="notificationPreferences.emailFrequency"
                  name="notificationPreferences.emailFrequency"
                  value={formik.values.notificationPreferences.emailFrequency}
                  onChange={formik.handleChange}
                  label="Email Frequency"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileForm;