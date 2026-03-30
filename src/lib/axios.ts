import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { useAuthStore } from './authStore'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401 with race-condition protection
let isRefreshing = false
let queue: Array<(token: string) => void> = []

function processQueue(token: string) {
  queue.forEach((cb) => cb(token))
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    const { refreshToken, setTokens, clear } = useAuthStore.getState()

    if (!refreshToken) {
      clear()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (original.headers) {
            original.headers.Authorization = `Bearer ${token}`
          }
          resolve(api(original))
        })
        void reject
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const res = await axios.post<{ accessToken: string; refreshToken: string }>(
        '/api/v1/auth/refresh',
        { refreshToken },
      )
      const { accessToken: newAccess, refreshToken: newRefresh } = res.data
      setTokens(newAccess, newRefresh)
      processQueue(newAccess)
      if (original.headers) {
        original.headers.Authorization = `Bearer ${newAccess}`
      }
      return api(original)
    } catch {
      queue = []
      clear()
      window.location.href = '/login'
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
