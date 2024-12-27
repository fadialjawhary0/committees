import axios from 'axios';

export const MeetingMembersServices = {
  create: async data => axios.post('/AddMeetingMember', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateMeetingMember/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllMeetingMembers').then(res => res?.data),
  delete: async id => axios.post(`/DeleteMeetingMember/${id}`).then(res => res?.data),
  getByID: async id => axios.get(`/GetMeetingMember/${id}`).then(res => res?.data),
};
