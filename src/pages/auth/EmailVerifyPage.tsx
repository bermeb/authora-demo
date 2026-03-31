import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { verifyEmail } from '../../api/email'
import { Card } from '../../components/ui/Card'
import { FullPageSpinner } from '../../components/ui/Spinner'
import { extractProblemDetail } from '../../lib/utils'

export function EmailVerifyPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setErrorMsg(t('auth.emailVerify.noToken'))
      setStatus('error')
      return
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        const p = extractProblemDetail(err)
        setErrorMsg(p.detail ?? t('auth.emailVerify.invalidToken'))
        setStatus('error')
      })
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') return <FullPageSpinner />

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        {status === 'success' ? (
          <>
            <div className="mb-4 text-4xl">✅</div>
            <h2 className="mb-2 text-lg font-bold text-gray-900">{t('auth.emailVerify.successTitle')}</h2>
            <p className="text-sm text-gray-600">{t('auth.emailVerify.successMessage')}</p>
            <Link
              to="/login"
              className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
            >
              {t('auth.emailVerify.goToLogin')}
            </Link>
          </>
        ) : (
          <>
            <div className="mb-4 text-4xl">❌</div>
            <h2 className="mb-2 text-lg font-bold text-gray-900">{t('auth.emailVerify.errorTitle')}</h2>
            <p className="text-sm text-gray-600">{errorMsg}</p>
            <Link
              to="/login"
              className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
            >
              {t('auth.register.goToLogin')}
            </Link>
          </>
        )}
      </Card>
    </div>
  )
}
