import api from '../lib/axios'
import type { SuccessResponse } from '../types/api'

export async function verifyEmail(token: string): Promise<SuccessResponse> {
  const res = await api.get<SuccessResponse>('/auth/email/verify', {
    params: { token },
  })
  return res.data
}
