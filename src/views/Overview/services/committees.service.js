import axios from 'axios';

export const CommitteeServices = {
  create: async data => axios.post('/AddCommittee', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateCommittee/${id}`, data).then(res => res?.data),
  delete: async id => axios.post(`/Common/DeleteCommitteeWithMembers/${id}`).then(res => res?.data),
  getAll: async () => axios.get('/GetAllCommittees').then(res => res?.data),
  getByID: async id => axios.get(`/GetCommittee/${id}`).then(res => res?.data),
  commonFormItems: async => axios.get('/Common/GetCommitteeAddItems').then(res => res?.data),
  commonCommitteeOverviewDetails: async => axios.get('/Common/GetAllCommitteeOverviewDetails').then(res => res?.data),
  commonCommitteeDetails: async id => axios.get(`/Common/GetCommitteeDetails/${id}`).then(res => res?.data),
};

export const CommitteeMembersServices = {
  create: async data => axios.post('/AddMember', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateMember/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllMembers').then(res => res?.data),
  getByID: async id => axios.get(`/GetMember/${id}`).then(res => res?.data),
};

export const MemberRolesServices = {
  create: async data => axios.post('/AddRole', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateRole/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllRoles').then(res => res?.data),
  getByID: async id => axios.get(`/GetRole/${id}`).then(res => res?.data),
};

export const CommitteeTypesServices = {
  create: async data => axios.post('/AddCommCat', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateCommCat/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllCommCat').then(res => res?.data),
  getByID: async id => axios.get(`/GetCommCat/${id}`).then(res => res?.data),
};
