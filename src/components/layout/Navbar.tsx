import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../lib/authStore'
import { logout } from '../../api/auth'
import { Button } from '../ui/Button'
import { getInitials } from '../../lib/utils'
import { LanguageSelect } from '../ui/LanguageSelect'
import logo from '/favicon.ico'

export function Navbar() {
  const { user, accessToken, refreshToken, clear } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

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
        <Link
          to={accessToken ? '/dashboard' : '/login'}
          className="flex items-center gap-2 text-lg font-bold text-indigo-600"
        >
          <img src={logo} alt="Authora" className="h-7 w-7" />
          <span>Authora</span>
        </Link>

        {accessToken && user ? (
          <div className="flex items-center gap-4">
            {user.roles.includes('ADMIN') && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                {t('nav.admin')}
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
            <LanguageSelect />
            <Button variant="ghost" onClick={() => { void handleLogout() }}>
              {t('nav.logout')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LanguageSelect />
            <Link to="/login">
              <Button variant="ghost">{t('nav.login')}</Button>
            </Link>
            <Link to="/register">
              <Button>{t('nav.register')}</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
