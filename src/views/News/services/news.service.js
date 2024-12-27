import axios from 'axios';

export const NewsServices = {
  create: async data => axios.post('/AddNews', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateNews/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllNews').then(res => res?.data),
  getByID: async id => axios.get(`/GetNews/${id}`).then(res => res?.data),
};
