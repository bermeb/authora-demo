import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { register as registerUser } from '../../api/auth'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ErrorBanner, extractProblemDetail } from '../../components/ui/ErrorBanner'
import { PasswordStrength } from '../../components/forms/PasswordStrength'
import type { ProblemDetail } from '../../types/api'

const schema = z.object({
  firstName: z.string().min(1, 'Vorname erforderlich').max(100),
  lastName: z.string().min(1, 'Nachname erforderlich').max(100),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(12, 'Mindestens 12 Zeichen').max(255),
})
type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const [apiError, setApiError] = useState<ProblemDetail | null>(null)
  const [success, setSuccess] = useState(false)
  const [watchedPassword, setWatchedPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setApiError(null)
    try {
      await registerUser(data)
      setSuccess(true)
    } catch (err) {
      setApiError(extractProblemDetail(err))
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">✉️</div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">Fast fertig!</h2>
          <p className="text-sm text-gray-600">
            Wir haben dir eine Bestätigungs-E-Mail geschickt. Klicke auf den Link, um dein Konto
            zu aktivieren.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
          >
            Zur Anmeldung
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-900">Konto erstellen</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorBanner error={apiError} />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Vorname"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Nachname"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <Input
            label="E-Mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="space-y-2">
            <Input
              label="Passwort"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password', {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setWatchedPassword(e.target.value),
              })}
            />
            <PasswordStrength password={watchedPassword} />
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">
            Registrieren
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Bereits registriert?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Anmelden
          </Link>
        </p>
      </Card>
    </div>
  )
}
