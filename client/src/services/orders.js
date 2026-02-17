import api from './api'

export const createOrder = (orderData) => api.post('/orders', orderData).then(res => res.data)
export const getMyOrders = () => api.get('/orders').then(res => res.data)
export const getOrder = (id) => api.get(`/orders/${id}`).then(res => res.data)