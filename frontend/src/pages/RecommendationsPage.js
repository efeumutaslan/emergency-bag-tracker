// frontend/src/pages/RecommendationsPage.js
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import recommendationService from '../services/recommendationService';
import { formatWeight } from '../utils/weightConverter';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await recommendationService.getRecommendations(selectedCategory);
        setRecommendations(data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading recommendations..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recommended Items
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Discover essential items to include in your emergency kit.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Filter by Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Medical">Medical</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Water">Water</MenuItem>
            <MenuItem value="Tools">Tools</MenuItem>
            <MenuItem value="Documents">Documents</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((recommendation) => (
            <Grid item xs={12} sm={6} md={4} key={recommendation._id}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {recommendation.name}
                    </Typography>
                    {recommendation.isEssential && (
                      <Chip 
                        label="Essential" 
                        color="primary" 
                        size="small" 
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={recommendation.category} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                    />
                  </Box>

                  <Typography variant="body2" paragraph>
                    {recommendation.description}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Average Weight: {formatWeight(recommendation.averageWeight, recommendation.weightUnit)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={RouterLink} 
                    to={`/items/add?name=${recommendation.name}&category=${recommendation.category}&weight=${recommendation.averageWeight}&weightUnit=${recommendation.weightUnit}`}
                    color="primary"
                    fullWidth
                  >
                    Add to My Kit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default RecommendationsPage;