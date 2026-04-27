import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
})

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('mechafind_user')
  if (stored) {
    const user = JSON.parse(stored)
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  }
  return config
})

// AUTH
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getUserProfile = () => API.get('/auth/profile')

// MECHANICS (CRUD)
export const getMechanics = () => API.get('/mechanics')
export const getMechanicById = (id) => API.get(`/mechanics/${id}`)
export const createMechanic = (data) => API.post('/mechanics', data)
export const updateMechanic = (id, data) => API.put(`/mechanics/${id}`, data)
export const deleteMechanic = (id) => API.delete(`/mechanics/${id}`)
export const suggestMechanic = (data) => API.post('/mechanics/suggest', data)

// REQUESTS
export const createRequest = (data) => API.post('/requests', data)
export const createEmergencyRequest = (data) => API.post('/requests/emergency', data)
export const getUserRequests = () => API.get('/requests/user')
export const getMechanicRequests = () => API.get('/requests/mechanic')
export const getAllRequests = () => API.get('/requests/all')
export const updateRequestStatus = (id, status) => API.put(`/requests/${id}/status`, { status })
export const deleteRequest = (id) => API.delete(`/requests/${id}`)

// REVIEWS
export const createReview = (data) => API.post('/reviews', data)
export const getMechanicReviews = (mechanicId) => API.get(`/reviews/mechanic/${mechanicId}`)

// MESSAGES
export const getMessages = (requestId) => API.get(`/messages/${requestId}`)

// ADMIN
export const approveMechanic = (id, data) => API.put(`/mechanics/${id}/approve`, data)
export const getUsers = () => API.get('/users')
export const deleteUser = (id) => API.delete(`/users/${id}`)