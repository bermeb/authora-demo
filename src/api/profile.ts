import api from '../lib/axios'
import type { MeResponse } from '../types/api'

export async function getMe(): Promise<MeResponse> {
  const res = await api.get<MeResponse>('/auth/me')
  return res.data
}
