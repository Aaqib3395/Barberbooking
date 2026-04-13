import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
  me:       ()     => API.get('/auth/me')
};

export const barbersAPI = {
  getAll:      ()                        => API.get('/barbers'),
  getOne:      (id)                      => API.get(`/barbers/${id}`),
  getSlots:    (id, date, duration)      => API.get(`/barbers/${id}/slots?date=${date}&duration=${duration}`),
  updateProfile: (data)                  => API.put('/barbers/profile', data)
};

export const bookingsAPI = {
  create:       (data) => API.post('/bookings', data),
  getMine:      (params) => API.get('/bookings/my', { params }),
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status })
};

export const adminAPI = {
  getBarbers:   () => API.get('/admin/barbers'),
  deleteBarber: (id) => API.delete(`/admin/barbers/${id}`),
  editBarber:   (id, data) => API.put(`/admin/barbers/${id}`, data),
  getBookings:  () => API.get('/admin/bookings'),
  getStats:     () => API.get('/admin/stats')
};

export default API;
