import axios from 'axios'

export const tokenKey = 'learnhub-token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem(tokenKey)
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

api.interceptors.response.use(response => response, error => {
  const token = localStorage.getItem(tokenKey)
  if (token && error.response?.status === 401 && error.config?.headers.Authorization === 'Bearer ' + token
    && !['/login', '/register'].includes(error.config.url)) {
    localStorage.removeItem(tokenKey)
    window.dispatchEvent(new Event('learnhub-session-expired'))
  }
  return Promise.reject(error)
})

export function errorMessage(error) {
  return error.response?.data?.message || 'Could not reach LearnHub. Please try again.'
}
