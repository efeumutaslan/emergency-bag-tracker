// frontend/src/services/itemService.js
import api from './api';

const ItemService = {
  getItems: async () => {
    const response = await api.get('/items');
    return response.data;
  },
  
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },
  
  getItem: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },
  
  updateItem: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },
  
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  }
};

export default ItemService;