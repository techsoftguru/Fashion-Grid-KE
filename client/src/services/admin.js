import api from './api';

export const getAllOrders = () => api.get('/admin/orders').then(res => res.data);
export const updateOrderStatus = (id, data) => api.put(`/admin/orders/${id}`, data).then(res => res.data);
export const getAnalytics = () => api.get('/admin/analytics').then(res => res.data);
export const getUsers = () => api.get('/admin/users').then(res => res.data);