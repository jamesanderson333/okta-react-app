/**
 * API Client for Backend Communication
 */

import axios from 'axios';

class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        // Extract error message from response
        const message = error.response?.data?.error?.message || 'An error occurred';
        throw new Error(message);
      }
    );
  }

  /**
   * Set authentication token for API requests
   */
  setAuthToken(token) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    const response = await this.axiosInstance.get('/api/user/profile');
    return response.data;
  }

  /**
   * Update user email
   */
  async updateEmail(newEmail) {
    const response = await this.axiosInstance.post('/api/user/email', {
      newEmail
    });
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    const response = await this.axiosInstance.put('/api/user/profile', profileData);
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(oldPassword, newPassword) {
    const response = await this.axiosInstance.post('/api/user/password', {
      oldPassword,
      newPassword
    });
    return response.data;
  }

  /**
   * Get custom metadata
   */
  async getMetadata() {
    const response = await this.axiosInstance.get('/api/user/metadata');
    return response.data;
  }

  /**
   * Update custom metadata
   */
  async updateMetadata(attributes) {
    const response = await this.axiosInstance.put('/api/user/metadata', attributes);
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck() {
    const response = await this.axiosInstance.get('/api/health');
    return response.data;
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
