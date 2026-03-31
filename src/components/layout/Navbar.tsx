import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../lib/authStore'
import { logout } from '../../api/auth'
import { Button } from '../ui/Button'
import { getInitials } from '../../lib/utils'
import { LANG_STORAGE_KEY, LANGUAGES, type Language } from '../../i18n'

export function Navbar() {
  const { user, accessToken, refreshToken, clear } = useAuthStore()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

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

  function handleLanguageChange(code: Language) {
    i18n.changeLanguage(code)
    localStorage.setItem(LANG_STORAGE_KEY, code)
  }

  const langSelect = (
    <select
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.target.value as Language)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
    </select>
  )

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to={accessToken ? '/dashboard' : '/login'}
          className="flex items-center gap-2 text-lg font-bold text-indigo-600"
        >
          <img src="/favicon.ico" alt="Authora" className="h-7 w-7" />
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
            {langSelect}
            <Button variant="ghost" onClick={() => { void handleLogout() }}>
              {t('nav.logout')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {langSelect}
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
