// frontend/src/components/items/ItemsList.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Grid, 
  Box, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  InputAdornment 
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import itemService from '../../services/itemService';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import ItemCard from './ItemCard';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    category: '',
    search: '',
    sort: 'name'
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getItems();
        setItems(data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteItem = (deletedItemId) => {
    setItems(items.filter(item => item._id !== deletedItemId));
  };

  const handleFilterChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.value
    });
  };

  // Apply filters and sorting
  const filteredItems = items.filter(item => {
    const matchesCategory = filter.category ? item.category === filter.category : true;
    const matchesSearch = filter.search 
      ? item.name.toLowerCase().includes(filter.search.toLowerCase()) 
      : true;
    
    return matchesCategory && matchesSearch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (filter.sort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'expirationAsc':
        if (!a.expirationDate) return 1;
        if (!b.expirationDate) return -1;
        return new Date(a.expirationDate) - new Date(b.expirationDate);
      case 'expirationDesc':
        if (!a.expirationDate) return 1;
        if (!b.expirationDate) return -1;
        return new Date(b.expirationDate) - new Date(a.expirationDate);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'weight':
        return a.weight - b.weight;
      default:
        return 0;
    }
  });

  if (loading) {
    return <LoadingSpinner message="Loading items..." />;
  }

  if (error) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          component={RouterLink} 
          to="/dashboard" 
          variant="contained" 
          color="primary"
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  // Display empty state if no items exist
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Emergency Items
        </Typography>
        <Button
          component={RouterLink}
          to="/items/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Item
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="search"
            label="Search Items"
            value={filter.search}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              label="Category"
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
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              name="sort"
              value={filter.sort}
              onChange={handleFilterChange}
              label="Sort By"
            >
              <MenuItem value="name">Name (A-Z)</MenuItem>
              <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
              <MenuItem value="expirationAsc">Expiration (Soonest First)</MenuItem>
              <MenuItem value="expirationDesc">Expiration (Latest First)</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="weight">Weight (Lightest First)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">No items match your filters</Typography>
          <Button onClick={() => setFilter({ category: '', search: '', sort: 'name' })}>
            Clear Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <ItemCard item={item} onDelete={handleDeleteItem} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ItemsList;