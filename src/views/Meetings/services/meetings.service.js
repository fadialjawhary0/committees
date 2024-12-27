import axios from 'axios';

export const MeetingServices = {
  create: async data => axios.post('/AddMeeting', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateMeeting/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllMeetings').then(res => res?.data),
  getByID: async id => axios.get(`/GetMeeting/${id}`).then(res => res?.data),
  delete: async id => axios.post(`/DeleteMeeting/${id}`).then(res => res?.data),
  commonFormItems: async committeeId => axios.get(`/Common/GetMeetingAddItems/${committeeId || ''}`).then(res => res?.data),
  commonDeleteMeetingWithAgendas: async id => axios.post(`/Common/DeleteMeetingWithAgendas/${id}`).then(res => res?.data),
  commonMeetingDetails: async id => axios.get(`/Common/GetMeetingDetails/${id}`).then(res => res?.data),
};
