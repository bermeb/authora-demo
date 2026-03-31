import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { register as registerUser } from '../../api/auth'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { PasswordStrength } from '../../components/forms/PasswordStrength'
import { extractProblemDetail } from '../../lib/utils'
import type { ProblemDetail } from '../../types/api'

function buildSchema(t: TFunction) {
  return z.object({
    firstName: z.string().min(1, t('validation.firstNameRequired')).max(100),
    lastName: z.string().min(1, t('validation.lastNameRequired')).max(100),
    email: z.string().email(t('validation.email')),
    password: z.string().min(12, t('validation.passwordMin')).max(255),
  })
}
type FormData = { firstName: string; lastName: string; email: string; password: string }

export function RegisterPage() {
  const [apiError, setApiError] = useState<ProblemDetail | null>(null)
  const [success, setSuccess] = useState(false)
  const [watchedPassword, setWatchedPassword] = useState('')
  const { t } = useTranslation()

  const schema = useMemo(() => buildSchema(t), [t])

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
          <h2 className="mb-2 text-lg font-bold text-gray-900">{t('auth.register.successTitle')}</h2>
          <p className="text-sm text-gray-600">{t('auth.register.successMessage')}</p>
          <Link
            to="/login"
            className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
          >
            {t('auth.register.goToLogin')}
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-900">{t('auth.register.title')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorBanner error={apiError} />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('auth.register.firstName')}
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label={t('auth.register.lastName')}
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <Input
            label={t('auth.register.email')}
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="space-y-2">
            <Input
              label={t('auth.register.password')}
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
            {t('auth.register.submit')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            {t('auth.register.login')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
