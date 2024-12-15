import axios from 'axios';

export const CommitteeServices = {
  create: async data => axios.post('/AddCommittee', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateCommittee/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllCommittees').then(res => res?.data),
  getByID: async id => axios.get(`/GetCommittee/${id}`).then(res => res?.data),
};
