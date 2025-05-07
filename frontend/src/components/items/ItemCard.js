// frontend/src/components/items/ItemCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Info as InfoIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import itemService from '../../services/itemService';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatDate, getExpirationStatus } from '../../utils/dateHelpers';
import { formatWeight } from '../../utils/weightConverter';

const ItemCard = ({ item, onDelete }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const handleEdit = () => {
    navigate(`/items/edit/${item._id}`);
  };
  
  const handleDelete = async () => {
    try {
      await itemService.deleteItem(item._id);
      enqueueSnackbar('Item deleted successfully', { variant: 'success' });
      onDelete(item._id);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Error deleting item', { variant: 'error' });
    }
  };

  const { status, color } = item.expirationDate 
    ? getExpirationStatus(item.expirationDate) 
    : { status: 'no-expiry', color: 'default' };

  return (
    <>
      <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {item.name}
            </Typography>
            {item.isEssential && (
              <Chip 
                label="Essential" 
                color="primary" 
                size="small" 
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Box sx={{ mb: 1 }}>
            <Chip 
              label={item.category} 
              size="small" 
              color="secondary" 
              variant="outlined" 
            />
          </Box>

          <Typography variant="body2" color="textSecondary" gutterBottom>
            Weight: {formatWeight(item.weight, item.weightUnit)}
            {item.quantity > 1 && ` × ${item.quantity}`}
          </Typography>
          
          {item.expirationDate && (
            <Typography variant="body2" color="textSecondary">
              Expires: {formatDate(item.expirationDate)}
              <Chip 
                label={status === 'expired' ? 'Expired' : status === 'critical' ? 'Expiring soon' : status === 'warning' ? 'Expiring' : 'Valid'} 
                color={color} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          )}
          
          {item.notes && (
            <Tooltip title={item.notes}>
              <IconButton size="small" sx={{ p: 0, ml: 1 }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
          <Button 
            startIcon={<EditIcon />} 
            size="small" 
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button 
            startIcon={<DeleteIcon />} 
            color="error" 
            size="small" 
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Item"
        message={`Are you sure you want to delete ${item.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmButtonColor="error"
      />
    </>
  );
};

export default ItemCard;