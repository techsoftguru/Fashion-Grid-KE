import api from './api'

export const login = (email, password) => api.post('/auth/login', { email, password }).then(res => res.data)
export const register = (name, email, password, phone) => api.post('/auth/register', { name, email, password, phone }).then(res => res.data)
export const getProfile = () => api.get('/auth/me').then(res => res.data)