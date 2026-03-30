import api from '../lib/axios'
import type {
  PaginatedUserResponse,
  AdminUserView,
  PaginatedAuditLog,
  SuccessResponse,
  Role,
} from '../types/api'

export async function listUsers(page = 0, size = 20): Promise<PaginatedUserResponse> {
  const res = await api.get<PaginatedUserResponse>('/admin/users', {
    params: { page, size },
  })
  return res.data
}

export async function getUser(id: string): Promise<AdminUserView> {
  const res = await api.get<AdminUserView>(`/admin/users/${id}`)
  return res.data
}

export async function setLock(id: string, locked: boolean): Promise<SuccessResponse> {
  const res = await api.put<SuccessResponse>(`/admin/users/${id}/lock`, null, {
    params: { locked },
  })
  return res.data
}

export async function setEnabled(id: string, enabled: boolean): Promise<SuccessResponse> {
  const res = await api.put<SuccessResponse>(`/admin/users/${id}/enable`, null, {
    params: { enabled },
  })
  return res.data
}

export async function assignRole(id: string, role: Role): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>(`/admin/users/${id}/roles/${role}`)
  return res.data
}

export async function removeRole(id: string, role: Role): Promise<SuccessResponse> {
  const res = await api.delete<SuccessResponse>(`/admin/users/${id}/roles/${role}`)
  return res.data
}

export async function revokeSessions(id: string): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>(`/admin/users/${id}/revoke-sessions`)
  return res.data
}

export async function allAuditLogs(page = 0, size = 50): Promise<PaginatedAuditLog> {
  const res = await api.get<PaginatedAuditLog>('/admin/audit-logs', {
    params: { page, size },
  })
  return res.data
}

export async function userAuditLogs(
  userId: string,
  page = 0,
  size = 50,
): Promise<PaginatedAuditLog> {
  const res = await api.get<PaginatedAuditLog>(`/admin/audit-logs/users/${userId}`, {
    params: { page, size },
  })
  return res.data
}
