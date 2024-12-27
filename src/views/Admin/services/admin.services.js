import axios from 'axios';

export const UsersService = {
  create: async data => axios.post('/AddSystemUser', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateSystemUser/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllSystemUsers').then(res => res?.data),
  getByID: async id => axios.get(`/GetSystemUser/${id}`).then(res => res?.data),
};

export const LocationServices = {
  create: async data => axios.post('/AddLocation', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateLocation/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllLocation').then(res => res?.data),
  getByID: async id => axios.get(`/GetLocation/${id}`).then(res => res?.data),
};

export const RoomServices = {
  create: async data => axios.post('/AddRoom', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateRoom/${id}`, data).then(res => res?.data),
  getAll: async () => axios.get('/GetAllRoom').then(res => res?.data),
  getByID: async id => axios.get(`/GetRoom/${id}`).then(res => res?.data),
};

export const BuildingServices = {
  create: async data => axios.post('/AddBuilding', data).then(res => res?.data),
  update: async (id, data) => axios.post(`/UpdateBuilding/${id}`, data).then(res => res?.data),
  delete: async id => axios.post(`/DeleteBuilding/${id}`).then(res => res?.data),
  getAll: async () => axios.get('/GetAllBuildings').then(res => res?.data),
  getByID: async id => axios.get(`/GetBuilding/${id}`).then(res => res?.data),
};
