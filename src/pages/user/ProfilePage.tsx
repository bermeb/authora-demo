import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import toast from 'react-hot-toast'
import { getMe } from '../../api/profile'
import { changePassword } from '../../api/password'
import { useAuthStore } from '../../lib/authStore'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { RoleBadge } from '../../components/ui/Badge'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { PasswordStrength } from '../../components/forms/PasswordStrength'
import { FullPageSpinner } from '../../components/ui/Spinner'
import { formatDate, extractProblemDetail } from '../../lib/utils'
import type { ProblemDetail, UserProfile } from '../../types/api'

function buildSchema(t: TFunction) {
  return z
    .object({
      currentPassword: z.string().min(1, t('validation.currentPasswordRequired')),
      newPassword: z.string().min(12, t('validation.passwordMin')),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })
}
type FormData = { currentPassword: string; newPassword: string; confirmPassword: string }

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [apiError, setApiError] = useState<ProblemDetail | null>(null)
  const [watchedPassword, setWatchedPassword] = useState('')
  const { clear } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const schema = useMemo(() => buildSchema(t), [t])

  useEffect(() => {
    getMe()
      .then((r) => setProfile(r.user))
      .catch(() => toast.error(t('common.unknownError')))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setApiError(null)
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success(t('profile.successToast'))
      clear()
      navigate('/login')
    } catch (err) {
      setApiError(extractProblemDetail(err))
      reset({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
  }

  if (!profile) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('profile.myData')}</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <dt className="font-medium text-gray-500">{t('profile.name')}</dt>
          <dd className="text-gray-900">{profile.firstName} {profile.lastName}</dd>
          <dt className="font-medium text-gray-500">{t('profile.email')}</dt>
          <dd className="text-gray-900">{profile.email}</dd>
          <dt className="font-medium text-gray-500">{t('profile.roles')}</dt>
          <dd className="flex flex-wrap gap-1">
            {profile.roles.map((r) => <RoleBadge key={r} role={r} />)}
          </dd>
          <dt className="font-medium text-gray-500">{t('profile.emailVerified')}</dt>
          <dd className={profile.emailVerified ? 'text-green-600' : 'text-yellow-600'}>
            {profile.emailVerified ? t('profile.verified') : t('profile.notVerified')}
          </dd>
          {profile.lastLoginAt && (
            <>
              <dt className="font-medium text-gray-500">{t('profile.lastLogin')}</dt>
              <dd className="text-gray-900">{formatDate(profile.lastLoginAt)}</dd>
            </>
          )}
          <dt className="font-medium text-gray-500">{t('profile.createdAt')}</dt>
          <dd className="text-gray-900">{formatDate(profile.createdAt)}</dd>
        </dl>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('profile.changePassword')}</h2>
        <p className="mb-4 text-sm text-gray-500">{t('profile.changePasswordHint')}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorBanner error={apiError} />
          <Input
            label={t('profile.currentPassword')}
            type="password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <div className="space-y-2">
            <Input
              label={t('profile.newPassword')}
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
            label={t('profile.confirmPassword')}
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" loading={isSubmitting}>
            {t('profile.save')}
          </Button>
        </form>
      </Card>
    </div>
  )
}
