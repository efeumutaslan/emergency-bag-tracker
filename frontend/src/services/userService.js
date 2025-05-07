// frontend/src/services/userService.js
import api from './api';

const UserService = {
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    
    // Update the user in localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.data;
  }
};

export default UserService;