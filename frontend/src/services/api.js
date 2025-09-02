import axios from 'axios';

const API_BASE_URL = '/api/docs';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const uploadFile = (formData) => {
  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data)
    .catch(error => {
      console.error('Upload error:', error);
      throw error;
    });
};

export const getFiles = () => {
  return axios.get(API_BASE_URL)
    .then(response => {
      return Array.isArray(response.data) ? response.data : [];
    })
    .catch(error => {
      console.error('Get files error:', error);
      throw error;
    });
};

export const toggleFavorite = (fileId) => {
  return axios.patch(`${API_BASE_URL}/${fileId}/favorite`)
    .then(response => response.data)
    .catch(error => {
      console.error('Toggle favorite error:', error);
      throw error;
    });
};

export const togglePin = (fileId) => {
  return axios.patch(`${API_BASE_URL}/${fileId}/pin`)
    .then(response => response.data)
    .catch(error => {
      console.error('Toggle pin error:', error);
      throw error;
    });
};

export const deleteFile = (fileId) => {
  return axios.delete(`${API_BASE_URL}/${fileId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Delete error:', error);
      throw error;
    });
};

export const uploadNewVersion = (fileId, formData) => {
  return axios.post(`${API_BASE_URL}/${fileId}/version`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data)
    .catch(error => {
      console.error('Upload new version error:', error);
      throw error;
    });
};

export const restoreVersion = (fileId, versionNumber) => {
  return axios.post(`${API_BASE_URL}/${fileId}/restore/${versionNumber}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Restore version error:', error);
      throw error;
    });
};