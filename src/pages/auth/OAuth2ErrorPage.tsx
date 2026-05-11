import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui/Card'

export function OAuth2ErrorPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const message = params.get('message')

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <div className="mb-4 text-4xl">❌</div>
        <h2 className="mb-2 text-lg font-bold text-gray-900">{t('auth.oauth.errorTitle')}</h2>
        <p className="text-sm text-gray-600">
          {message ?? t('auth.oauth.failed')}
        </p>
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
