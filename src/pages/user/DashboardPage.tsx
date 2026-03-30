import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { logout, logoutAll } from '../../api/auth'
import { useAuthStore } from '../../lib/authStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { RoleBadge } from '../../components/ui/Badge'
import { getInitials, formatDate } from '../../lib/utils'

export function DashboardPage() {
  const { user, refreshToken, clear } = useAuthStore()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [loggingOutAll, setLoggingOutAll] = useState(false)

  if (!user) return null

  async function handleLogout() {
    setLoggingOut(true)
    try {
      if (refreshToken) await logout(refreshToken)
    } catch { /* ignore */ }
    clear()
    navigate('/login')
  }

  async function handleLogoutAll() {
    setLoggingOutAll(true)
    try {
      await logoutAll()
      toast.success('Alle Sitzungen beendet.')
    } catch { /* ignore */ }
    clear()
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {user.roles.map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.emailVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {user.emailVerified ? 'E-Mail verifiziert' : 'E-Mail nicht verifiziert'}
              </span>
            </div>
            {user.createdAt && (
              <p className="pt-1 text-xs text-gray-400">
                Konto erstellt: {formatDate(user.createdAt)}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/profile">
          <Button variant="ghost">Profil & Passwort</Button>
        </Link>
        <Button
          variant="ghost"
          loading={loggingOut}
          onClick={() => { void handleLogout() }}
        >
          Dieses Gerät abmelden
        </Button>
        <Button
          variant="danger"
          loading={loggingOutAll}
          onClick={() => { void handleLogoutAll() }}
        >
          Alle Geräte abmelden
        </Button>
        {user.roles.includes('ADMIN') && (
          <Link to="/admin">
            <Button>Admin-Bereich</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
