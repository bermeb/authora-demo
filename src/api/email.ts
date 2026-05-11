import api from '../lib/axios'
import type { SuccessResponse } from '../types/api'

export async function verifyEmail(token: string): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>('/auth/email/verify', { token })
  return res.data
}
