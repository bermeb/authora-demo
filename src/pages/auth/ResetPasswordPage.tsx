import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { resetPassword } from '../../api/password'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ErrorBanner, extractProblemDetail } from '../../components/ui/ErrorBanner'
import { PasswordStrength } from '../../components/forms/PasswordStrength'
import type { ProblemDetail } from '../../types/api'

const schema = z
  .object({
    newPassword: z.string().min(12, 'Mindestens 12 Zeichen').max(255),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  })
type FormData = z.infer<typeof schema>

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<ProblemDetail | null>(null)
  const [watchedPassword, setWatchedPassword] = useState('')

  const token = params.get('token') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    if (!token) {
      setApiError({ status: 400, detail: 'Kein Reset-Token in der URL.' })
      return
    }
    setApiError(null)
    try {
      await resetPassword({ token, newPassword: data.newPassword })
      toast.success('Passwort geändert. Bitte melde dich an.')
      navigate('/login')
    } catch (err) {
      setApiError(extractProblemDetail(err))
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <p className="text-sm text-gray-600">Ungültiger oder fehlender Reset-Token.</p>
          <Link to="/auth/password/forgot" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            Neuen Link anfordern
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-900">Neues Passwort</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorBanner error={apiError} />
          <div className="space-y-2">
            <Input
              label="Neues Passwort"
              type="password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword', {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setWatchedPassword(e.target.value),
              })}
            />
            <PasswordStrength password={watchedPassword} />
          </div>
          <Input
            label="Passwort bestätigen"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Passwort speichern
          </Button>
        </form>
      </Card>
    </div>
  )
}
