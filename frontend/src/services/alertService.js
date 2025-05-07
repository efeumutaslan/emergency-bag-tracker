// frontend/src/services/alertService.js
import api from './api';

const AlertService = {
  getExpirationAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  }
};

export default AlertService;