import api from './api';

const lookupService = {
  // Get all lookups (flavours, toppings, consistencies, config)
  getAllLookups: async () => {
    try {
      const response = await api.get('/lookups');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch lookups' };
    }
  },

  // FLAVOURS
  createFlavour: async (flavour) => {
    try {
      const response = await api.post('/lookups/flavours', flavour);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create flavour' };
    }
  },

  updateFlavour: async (id, flavour) => {
    try {
      const response = await api.put(`/lookups/flavours/${id}`, flavour);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update flavour' };
    }
  },

  deleteFlavour: async (id) => {
    try {
      const response = await api.delete(`/lookups/flavours/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete flavour' };
    }
  },

  // TOPPINGS
  createTopping: async (topping) => {
    try {
      const response = await api.post('/lookups/toppings', topping);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create topping' };
    }
  },

  updateTopping: async (id, topping) => {
    try {
      const response = await api.put(`/lookups/toppings/${id}`, topping);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update topping' };
    }
  },

  deleteTopping: async (id) => {
    try {
      const response = await api.delete(`/lookups/toppings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete topping' };
    }
  },

  // CONSISTENCIES
  createConsistency: async (consistency) => {
    try {
      const response = await api.post('/lookups/consistencies', consistency);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create consistency' };
    }
  },

  updateConsistency: async (id, consistency) => {
    try {
      const response = await api.put(`/lookups/consistencies/${id}`, consistency);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update consistency' };
    }
  },

  deleteConsistency: async (id) => {
    try {
      const response = await api.delete(`/lookups/consistencies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete consistency' };
    }
  },

  // CONFIG
  updateConfig: async (config) => {
    try {
      const response = await api.put('/lookups/config', config);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update config' };
    }
  },

  // AUDIT LOGS
  getAuditLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/lookups/audit-logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch audit logs' };
    }
  }
};

export default lookupService;