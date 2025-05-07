// frontend/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import itemService from '../services/itemService';
import recommendationService from '../services/recommendationService';
import alertService from '../services/alertService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AlertBanner from '../components/ui/AlertBanner';
import EmptyState from '../components/ui/EmptyState';
import { formatDate } from '../utils/dateHelpers';
import { calculateTotalWeight } from '../utils/weightConverter';
import { calculateWeightSafety } from '../utils/weightSafety';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [essentialMissing, setEssentialMissing] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch items
        const itemsData = await itemService.getItems();
        setItems(itemsData);

        // Fetch expiring items
        const alertsData = await alertService.getExpirationAlerts();
        setExpiringItems(alertsData);

        // Fetch essential recommendations
        const essentials = await recommendationService.getEssentialRecommendations();
        
        // Find missing essentials
        const essentialCategories = essentials.map(e => e.category);
        const userCategories = [...new Set(itemsData.map(item => item.category))];
        
        const missingCategories = essentialCategories.filter(
          category => !userCategories.includes(category)
        );
        
        const missingEssentials = essentials.filter(
          essential => missingCategories.includes(essential.category)
        );
        
        setEssentialMissing(missingEssentials);
      } catch (error) {
        setError(error.response?.data?.message || 'Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate weight statistics
  const totalWeight = items.length > 0 ? calculateTotalWeight(items, 'kg') : 0;
  const weightSafety = calculateWeightSafety(totalWeight, user?.weight);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back, {user?.firstName}! Here's an overview of your emergency kit.
          // frontend/src/pages/DashboardPage.js (continued)
        </Typography>
      </Box>
      
      {/* Alert for expiring items */}
      <AlertBanner alertItems={expiringItems} />
      
      {/* Dashboard content */}
      {items.length === 0 ? (
        <EmptyState 
          title="Your emergency kit is empty" 
          message="Start by adding items to your emergency kit to track expiration dates and ensure you're prepared."
          actionText="Add Your First Item"
          actionLink="/items/add"
        />
      ) : (
        <Grid container spacing={4}>
          {/* Kit Summary */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Kit Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Items
                  </Typography>
                  <Typography variant="h5">
                    {items.length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Categories
                  </Typography>
                  <Typography variant="h5">
                    {new Set(items.map(item => item.category)).size}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Weight
                  </Typography>
                  <Typography variant="h5">
                    {totalWeight.toFixed(2)} kg
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Items Expiring Soon
                  </Typography>
                  <Typography variant="h5" color={expiringItems.length > 0 ? "error.main" : "inherit"}>
                    {expiringItems.length}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  component={RouterLink}
                  to="/items"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  View All Items
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Weight Safety Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Weight Safety Assessment
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {!user?.weight ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <InfoIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography paragraph>
                    Update your profile with your weight to see if your bag is safe to carry.
                  </Typography>
                  <Button 
                    component={RouterLink} 
                    to="/profile" 
                    variant="outlined"
                  >
                    Update Profile
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" paragraph>
                    Based on your weight ({user.weight} kg), your emergency bag should ideally weigh no more than {(user.weight * 0.2).toFixed(1)} kg.
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Current bag weight: {totalWeight.toFixed(2)} kg
                      </Typography>
                      <Typography variant="body2" color={
                        weightSafety?.status === 'unsafe' ? 'error.main' : 
                        weightSafety?.status === 'caution' ? 'warning.main' : 
                        'success.main'
                      }>
                        {weightSafety?.status === 'unsafe' ? 'Too Heavy' : 
                         weightSafety?.status === 'caution' ? 'Approaching Max' : 
                         'Safe Weight'}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(weightSafety?.percentage || 0, 100)} 
                      color={
                        weightSafety?.status === 'unsafe' ? 'error' : 
                        weightSafety?.status === 'caution' ? 'warning' : 
                        'success'
                      }
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary">
                    {weightSafety?.message}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Recent Items */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recently Added Items
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/items/add" 
                  startIcon={<AddIcon />}
                  size="small"
                >
                  Add New
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {items.slice(0, 5).map(item => (
                  <ListItem key={item._id} disablePadding sx={{ mb: 1 }}>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.category} • Added on ${formatDate(item.createdAt)}`}
                    />
                    <Chip 
                      label={item.weightUnit === 'g' ? `${item.weight}g` : `${item.weight}${item.weightUnit}`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          {/* Expiring Items */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Expiring Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {expiringItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography>
                    No items expiring soon. You're all set!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {expiringItems.map(item => (
                    <ListItem key={item._id} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <WarningIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={`Expires on ${formatDate(item.expirationDate)}`}
                      />
                      <Button 
                        component={RouterLink} 
                        to={`/items/edit/${item._id}`} 
                        size="small" 
                        variant="outlined"
                      >
                        Replace
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
          
          {/* Essential Recommendations */}
          {essentialMissing.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recommended Essential Items
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" paragraph>
                  Based on your current items, we recommend adding these essential categories to your emergency kit:
                </Typography>
                
                <Grid container spacing={2}>
                  {essentialMissing.slice(0, 3).map(item => (
                    <Grid item xs={12} sm={4} key={item._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {item.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    component={RouterLink} 
                    to="/recommendations" 
                    variant="outlined" 
                  >
                    View All Recommendations
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default DashboardPage;
          