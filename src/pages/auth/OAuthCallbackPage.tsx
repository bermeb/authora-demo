import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/axios'
import { getMe } from '../../api/profile'
import { useAuthStore } from '../../lib/authStore'
import { Spinner } from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'

// Backend delivers the OAuth exchange code in the URL fragment (e.g. #code=…),
// not the query string, so the value never reaches a server log or Referer header.
function readFromFragment(hash: string): URLSearchParams {
  return new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
}

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const called = useRef(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (called.current) return
    called.current = true

    const fragmentParams = readFromFragment(window.location.hash)
    const code = fragmentParams.get('code')
    const errorParam = fragmentParams.get('error')

    if (errorParam) {
      setError(t('auth.oauth.error', { error: errorParam }))
      return
    }

    if (!code) {
      setError(t('auth.oauth.noCode'))
      return
    }

    // Drop the fragment from the address bar so the code isn't kept in history
    window.history.replaceState(null, '', window.location.pathname + window.location.search)

    api
      .post<{ accessToken: string; refreshToken: string }>('/auth/oauth2/exchange', { code })
      .then(async (res) => {
        setTokens(res.data.accessToken, res.data.refreshToken)
        const me = await getMe()
        setUser(me.user)
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        setError(t('auth.oauth.failed'))
      })
  }, [navigate, setTokens, setUser]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 text-sm text-indigo-600 hover:underline"
          >
            {t('auth.forgotPassword.back')}
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center space-y-3">
        <Spinner />
        <p className="text-gray-600 text-sm">{t('auth.oauth.loading')}</p>
      </div>
    </div>
  )
}
