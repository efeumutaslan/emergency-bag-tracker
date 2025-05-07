// frontend/src/pages/HomePage.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import { 
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
  HealthAndSafety as HealthAndSafetyIcon 
} from '@mui/icons-material';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Box sx={{ 
        textAlign: 'center',
        py: 6
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Emergency Bag Tracker
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Keep track of your emergency supplies, receive expiration alerts, and ensure your emergency kit is always ready.
          </Typography>
          <Box sx={{ mt: 4 }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/dashboard"
                sx={{ minWidth: 200 }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Box sx={{ '& > *': { m: 1 } }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/register"
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/login"
                >
                  Log In
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <InventoryIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Item Management
                </Typography>
                <Typography align="center">
                  Add, edit, and organize emergency items. Track expiration dates, weights, and categories.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Expiration Alerts
                </Typography>
                <Typography align="center">
                  Receive timely notifications when your emergency supplies are nearing expiration.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <HealthAndSafetyIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Weight Safety
                </Typography>
                <Typography align="center">
                  Calculate if your emergency bag is within a safe carrying capacity based on your profile.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to action */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" component="h2" gutterBottom>
            Start Tracking Your Emergency Kit Today
          </Typography>
          <Typography paragraph>
            Be prepared for any emergency. Create your account now and start managing your emergency supplies.
          </Typography>
          {!isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ mt: 2 }}
            >
              Get Started
            </Button>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;