import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { forgotPassword } from '../../api/password'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

function buildSchema(t: TFunction) {
  return z.object({ email: z.string().email(t('validation.email')) })
}
type FormData = { email: string }

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { t } = useTranslation()

  const schema = useMemo(() => buildSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      await forgotPassword(data.email)
    } catch {
      // Anti-enumeration: always show success
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">📬</div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">{t('auth.forgotPassword.successTitle')}</h2>
          <p className="text-sm text-gray-600">{t('auth.forgotPassword.successMessage')}</p>
          <Link
            to="/login"
            className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
          >
            {t('auth.forgotPassword.back')}
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <h1 className="mb-2 text-xl font-bold text-gray-900">{t('auth.forgotPassword.title')}</h1>
        <p className="mb-6 text-sm text-gray-600">{t('auth.forgotPassword.description')}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('auth.forgotPassword.email')}
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            {t('auth.forgotPassword.submit')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="text-indigo-600 hover:underline">
            {t('auth.forgotPassword.back')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
