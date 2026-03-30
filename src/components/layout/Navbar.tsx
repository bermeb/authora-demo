import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../lib/authStore'
import { logout } from '../../api/auth'
import { Button } from '../ui/Button'
import { getInitials } from '../../lib/utils'
import toast from 'react-hot-toast'

export function Navbar() {
  const { user, accessToken, refreshToken, clear } = useAuthStore()
  const navigate = useNavigate()

  async function handleLogout() {
    if (refreshToken) {
      try {
        await logout(refreshToken)
      } catch {
        // ignore — clear anyway
      }
    }
    clear()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={accessToken ? '/dashboard' : '/login'} className="text-lg font-bold text-indigo-600">
          Authora
        </Link>

        {accessToken && user ? (
          <div className="flex items-center gap-4">
            {user.roles.includes('ADMIN') && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Admin
              </Link>
            )}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {getInitials(user.firstName, user.lastName)}
              </div>
              {user.firstName}
            </Link>
            <Button variant="ghost" onClick={() => { void handleLogout() }}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Registrieren</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export { toast }
