import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { RootLayout } from './components/layout/RootLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute, AdminRoute } from './components/ui/ProtectedRoute'
import { useAuthStore } from './lib/authStore'

import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { EmailVerifyPage } from './pages/auth/EmailVerifyPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { OAuthCallbackPage } from './pages/auth/OAuthCallbackPage'
import { DashboardPage } from './pages/user/DashboardPage'
import { ProfilePage } from './pages/user/ProfilePage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { UsersListPage } from './pages/admin/UsersListPage'
import { UserDetailPage } from './pages/admin/UserDetailPage'
import { AuditLogsPage } from './pages/admin/AuditLogsPage'

function RootRedirect() {
  const token = useAuthStore((s) => s.accessToken)
  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<RootRedirect />} />

          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/email/verify" element={<EmailVerifyPage />} />
          <Route path="/auth/password/forgot" element={<ForgotPasswordPage />} />
          <Route path="/auth/password/reset" element={<ResetPasswordPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<UsersListPage />} />
              <Route path="/admin/users/:id" element={<UserDetailPage />} />
              <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
