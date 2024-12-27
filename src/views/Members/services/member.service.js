import axios from 'axios';

export const MemberServices = {
  create: async data => axios.post('/AddSystemUser', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateSystemUser/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllSystemUsers').then(res => res?.data),
  getByID: async id => axios.get(`/GetSystemUser/${id}`).then(res => res?.data),
};
