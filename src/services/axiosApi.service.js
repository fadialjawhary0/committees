import axios from 'axios';

class AxiosApi {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Create method - POST
  async create(endpoint, data) {
    try {
      const response = await this.api.post(endpoint, data);
      return response?.data;
    } catch (error) {
      console.error('Error creating data:', error);
    }
  }

  // Update method - POST (since you prefer POST for updates)
  async update(endpoint, data) {
    try {
      const response = await this.api.post(`${endpoint}`, data);
      return response?.data;
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  // Delete method - POST (since you prefer POST for deletions)
  async delete(endpoint, id) {
    try {
      const response = await this.api.post(`${endpoint}/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  // Get all records - GET
  async getAll(endpoint) {
    try {
      const response = await this.api.get(endpoint);
      return response?.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Get by ID - GET
  async getById(endpoint, id) {
    try {
      const response = await this.api.get(`${endpoint}/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error fetching data by ID:', error);
    }
  }
}

const apiService = new AxiosApi('http://localhost:51878/api/');
export default apiService;