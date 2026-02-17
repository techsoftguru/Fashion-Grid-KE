import api from './api'

export const getDeliveryZones = () => api.get('/delivery-zones').then(res => res.data)