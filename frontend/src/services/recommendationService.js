// frontend/src/services/recommendationService.js
import api from './api';

const RecommendationService = {
  getRecommendations: async (category) => {
    const params = category ? { category } : {};
    const response = await api.get('/recommendations', { params });
    return response.data;
  },
  
  getEssentialRecommendations: async () => {
    const response = await api.get('/recommendations/essential');
    return response.data;
  }
};

export default RecommendationService;