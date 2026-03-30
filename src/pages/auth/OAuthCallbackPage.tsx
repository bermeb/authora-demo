import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/axios'
import { getMe } from '../../api/profile'
import { useAuthStore } from '../../lib/authStore'
import { Spinner } from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const called = useRef(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (called.current) return
    called.current = true

    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError(t('auth.oauth.error', { error: errorParam }))
      return
    }

    if (!code) {
      setError(t('auth.oauth.noCode'))
      return
    }

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
  }, [searchParams, navigate, setTokens, setUser]) // eslint-disable-line react-hooks/exhaustive-deps

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
