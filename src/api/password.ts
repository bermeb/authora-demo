import api from '../lib/axios'
import type { SuccessResponse } from '../types/api'

export async function forgotPassword(email: string): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>('/auth/password/forgot', { email })
  return res.data
}

export async function resetPassword(data: {
  token: string
  newPassword: string
}): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>('/auth/password/reset', data)
  return res.data
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>('/auth/password/change', data)
  return res.data
}
