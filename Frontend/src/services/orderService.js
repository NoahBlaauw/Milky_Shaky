import api from './api';

const orderService = {
  // Calculate order price before creating
  calculateOrder: async (drinks) => {
    try {
      const response = await api.post('/orders/calculate', { drinks });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to calculate order' };
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/create', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create order' };
    }
  },

  // Get current user's orders
  getMyOrders: async () => {
    try {
      const response = await api.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch orders' };
    }
  },

  // Get specific order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch order' };
    }
  },

  // Get all orders (manager only)
  getAllOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.isPaid !== undefined) params.append('isPaid', filters.isPaid);
      
      const response = await api.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch all orders' };
    }
  },

  // Get day of week report (manager only)
  getDayOfWeekReport: async () => {
    try {
      const response = await api.get('/orders/reports/day-of-week');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch report' };
    }
  }
};

export default orderService;