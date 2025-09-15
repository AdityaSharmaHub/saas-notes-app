import axios from 'axios';

// Notes API functions
export const notesApi = {
  // Get all notes
  getAll: async () => {
    const response = await axios.get('/notes');
    return response.data;
  },

  // Get specific note
  getById: async (id) => {
    const response = await axios.get(`/notes/${id}`);
    return response.data;
  },

  // Create new note
  create: async (noteData) => {
    const response = await axios.post('/notes', noteData);
    return response.data;
  },

  // Update note
  update: async (id, noteData) => {
    const response = await axios.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete note
  delete: async (id) => {
    const response = await axios.delete(`/notes/${id}`);
    return response.data;
  },
};

// Tenants API functions
export const tenantsApi = {
  // Upgrade tenant subscription (Admin only)
  upgrade: async (tenantSlug) => {
    const response = await axios.post(`/tenants/${tenantSlug}/upgrade`);
    return response.data;
  },

  // Get tenant info (Admin only)
  getInfo: async (tenantSlug) => {
    const response = await axios.get(`/tenants/${tenantSlug}/info`);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await axios.get('/health');
    return response.data;
  },
};

// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.error || error.response.data.message || 'An error occurred',
      details: error.response.data.details || null,
      status: error.response.status,
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      details: null,
      status: null,
    };
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred',
      details: null,
      status: null,
    };
  }
};