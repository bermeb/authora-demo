import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../../api/email'
import { Card } from '../../components/ui/Card'
import { FullPageSpinner } from '../../components/ui/Spinner'
import { extractProblemDetail } from '../../components/ui/ErrorBanner'

export function EmailVerifyPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setErrorMsg('Kein Token in der URL.')
      setStatus('error')
      return
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        const p = extractProblemDetail(err)
        setErrorMsg(p.detail ?? 'Token ungültig oder abgelaufen.')
        setStatus('error')
      })
  }, [params])

  if (status === 'loading') return <FullPageSpinner />

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        {status === 'success' ? (
          <>
            <div className="mb-4 text-4xl">✅</div>
            <h2 className="mb-2 text-lg font-bold text-gray-900">E-Mail bestätigt!</h2>
            <p className="text-sm text-gray-600">Dein Konto ist jetzt aktiv.</p>
            <Link
              to="/login"
              className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
            >
              Jetzt anmelden
            </Link>
          </>
        ) : (
          <>
            <div className="mb-4 text-4xl">❌</div>
            <h2 className="mb-2 text-lg font-bold text-gray-900">Bestätigung fehlgeschlagen</h2>
            <p className="text-sm text-gray-600">{errorMsg}</p>
            <Link
              to="/login"
              className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
            >
              Zur Anmeldung
            </Link>
          </>
        )}
      </Card>
    </div>
  )
}
