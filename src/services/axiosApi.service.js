import axios from 'axios';

class AxiosApi {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-UserId': +localStorage.getItem('userID') ?? '',
        'X-CommitteeId': +localStorage.getItem('selectedCommitteeID') ?? '',
        'X-MemberId': +localStorage.getItem('memberID') ?? '',
      },
    });
  }

  async create(endpoint, data, logTypeId) {
    try {
      const response = await this.api.post(endpoint, data, {
        headers: {
          'X-LogTypeId': logTypeId,
        },
      });
      return response?.data;
    } catch (error) {
      console.error('Error creating data:', error);
    }
  }

  async update(endpoint, data, logTypeId) {
    try {
      const response = await this.api.post(`${endpoint}`, data, {
        headers: {
          'X-LogTypeId': logTypeId,
        },
      });
      return response?.data;
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async delete(endpoint, id, logTypeId) {
    try {
      const response = await this.api.post(
        `${endpoint}/${id}`,
        {},
        {
          headers: {
            'X-LogTypeId': logTypeId,
          },
        },
      );
      return response?.data;
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  async getAll(endpoint) {
    try {
      const response = await this.api.get(endpoint);
      return response?.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

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
