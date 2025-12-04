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

  // Create new lookup item (flavours, toppings, or consistencies)
  createLookup: async (type, data) => {
    try {
      const response = await api.post(`/lookups/${type}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create lookup' };
    }
  },

  // Update lookup item
  updateLookup: async (type, id, data) => {
    try {
      const response = await api.put(`/lookups/${type}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update lookup' };
    }
  },

  // Delete lookup item
  deleteLookup: async (type, id) => {
    try {
      const response = await api.delete(`/lookups/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete lookup' };
    }
  },

  // Update system configuration
  updateConfig: async (data) => {
    try {
      const response = await api.put('/lookups/config', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update config' };
    }
  },

  // Get audit logs (manager only)
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