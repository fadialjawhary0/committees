import axios from 'axios';

export const AgendaServices = {
  create: async data => axios.post('/AddAgenda', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateAgenda/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllAgendas').then(res => res?.data),
  delete: async id => axios.post(`/DeleteAgenda/${id}`).then(res => res?.data),
  getByID: async id => axios.get(`/GetAgenda/${id}`).then(res => res?.data),
};
