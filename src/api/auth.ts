import api from '../lib/axios'
import type { TokenResponse, RegisterResponse, SuccessResponse } from '../types/api'

export async function register(data: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<RegisterResponse> {
  const res = await api.post<RegisterResponse>('/auth/register', data)
  return res.data
}

export async function login(data: {
  email: string
  password: string
}): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>('/auth/login', data)
  return res.data
}

export async function logout(refreshToken: string): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>('/auth/logout', { refreshToken })
  return res.data
}

export async function logoutAll(): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>('/auth/logout/all')
  return res.data
}
