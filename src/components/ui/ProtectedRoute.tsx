import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../lib/authStore'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.accessToken)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AdminRoute() {
  const { accessToken, user } = useAuthStore()
  if (!accessToken) return <Navigate to="/login" replace />
  if (!user?.roles.includes('ADMIN')) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
