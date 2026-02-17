import api from './api'

export const getProducts = (params) => api.get('/products', { params }).then(res => res.data)
export const getProduct = (id) => api.get(`/products/${id}`).then(res => res.data)
export const createProduct = (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data)
export const updateProduct = (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data)
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(res => res.data)