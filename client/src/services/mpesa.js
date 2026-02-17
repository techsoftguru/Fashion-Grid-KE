import api from './api'

export const stkPush = (phone, amount, orderId) => api.post('/mpesa/stkpush', { phone, amount, orderId }).then(res => res.data)