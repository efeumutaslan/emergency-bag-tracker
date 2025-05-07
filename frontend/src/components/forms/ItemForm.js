// frontend/src/components/forms/ItemForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  Switch,
  Typography,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSnackbar } from 'notistack';
import itemService from '../../services/itemService';
import recommendationService from '../../services/recommendationService';
import LoadingSpinner from '../ui/LoadingSpinner';
//import { formatDateInput } from '../../utils/dateHelpers';

const categories = [
  'Medical',
  'Food',
  'Water',
  'Tools',
  'Documents',
  'Clothing',
  'Electronics',
  'Other'
];

const weightUnits = ['g', 'kg', 'oz', 'lb'];

const ItemForm = ({ initialValues, isEditing = false }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialValues?.category || '');

  // Load recommendations when category changes
  React.useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedCategory) {
        try {
          const data = await recommendationService.getRecommendations(selectedCategory);
          setRecommendations(data.slice(0, 5)); // Limit to 5 recommendations
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      }
    };

    fetchRecommendations();
  }, [selectedCategory]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Item name is required'),
    category: Yup.string().required('Category is required'),
    weight: Yup.number().positive('Weight must be positive').required('Weight is required'),
    weightUnit: Yup.string().required('Weight unit is required'),
    quantity: Yup.number().integer('Quantity must be a whole number').min(1, 'Minimum quantity is 1').required('Quantity is required'),
    expirationDate: Yup.date().nullable(),
    notes: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || '',
      category: initialValues?.category || '',
      weight: initialValues?.weight || '',
      weightUnit: initialValues?.weightUnit || 'g',
      quantity: initialValues?.quantity || 1,
      expirationDate: initialValues?.expirationDate ? new Date(initialValues.expirationDate) : null,
      notes: initialValues?.notes || '',
      isEssential: initialValues?.isEssential || false
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEditing) {
          await itemService.updateItem(initialValues._id, values);
          enqueueSnackbar('Item updated successfully', { variant: 'success' });
        } else {
          await itemService.createItem(values);
          enqueueSnackbar('Item added successfully', { variant: 'success' });
        }
        navigate('/items');
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || 'Something went wrong', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
  });

  const handleCategoryChange = (event) => {
    formik.handleChange(event);
    setSelectedCategory(event.target.value);
  };

  const handleRecommendationClick = (recommendation) => {
    formik.setValues({
      ...formik.values,
      name: recommendation.name,
      category: recommendation.category,
      weight: recommendation.averageWeight,
      weightUnit: recommendation.weightUnit,
      isEssential: recommendation.isEssential
    });
  };

  if (loading) {
    return <LoadingSpinner message={isEditing ? "Updating item..." : "Adding item..."} />;
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Item Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.category && formik.errors.category && (
              <FormHelperText>{formik.errors.category}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Expiration Date (if applicable)"
              value={formik.values.expirationDate}
              onChange={(date) => formik.setFieldValue('expirationDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                  helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="weight"
            name="weight"
            label="Weight"
            type="number"
            value={formik.values.weight}
            onChange={formik.handleChange}
            error={formik.touched.weight && Boolean(formik.errors.weight)}
            helperText={formik.touched.weight && formik.errors.weight}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={formik.touched.weightUnit && Boolean(formik.errors.weightUnit)}>
            <InputLabel id="weight-unit-label">Weight Unit</InputLabel>
            <Select
              labelId="weight-unit-label"
              id="weightUnit"
              name="weightUnit"
              value={formik.values.weightUnit}
              onChange={formik.handleChange}
              label="Weight Unit"
            >
              {weightUnits.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.weightUnit && formik.errors.weightUnit && (
              <FormHelperText>{formik.errors.weightUnit}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="notes"
            name="notes"
            label="Notes"
            multiline
            rows={3}
            value={formik.values.notes}
            onChange={formik.handleChange}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isEssential}
                onChange={(e) => formik.setFieldValue('isEssential', e.target.checked)}
                name="isEssential"
                color="primary"
              />
            }
            label="Mark as essential item"
          />
        </Grid>

        {recommendations.length > 0 && !isEditing && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Recommendations based on selected category:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {recommendations.map((recommendation) => (
                  <Chip
                    key={recommendation._id}
                    label={recommendation.name}
                    onClick={() => handleRecommendationClick(recommendation)}
                    variant="outlined"
                    clickable
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={() => navigate('/items')} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemForm;