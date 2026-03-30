import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { getMe } from '../../api/profile'
import { changePassword } from '../../api/password'
import { useAuthStore } from '../../lib/authStore'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { RoleBadge } from '../../components/ui/Badge'
import { ErrorBanner, extractProblemDetail } from '../../components/ui/ErrorBanner'
import { PasswordStrength } from '../../components/forms/PasswordStrength'
import { FullPageSpinner } from '../../components/ui/Spinner'
import { formatDate } from '../../lib/utils'
import type { ProblemDetail, UserProfile } from '../../types/api'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Aktuelles Passwort erforderlich'),
    newPassword: z.string().min(12, 'Mindestens 12 Zeichen'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  })
type FormData = z.infer<typeof schema>

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [apiError, setApiError] = useState<ProblemDetail | null>(null)
  const [watchedPassword, setWatchedPassword] = useState('')
  const { clear } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    getMe()
      .then((r) => setProfile(r.user))
      .catch(() => toast.error('Profil konnte nicht geladen werden.'))
  }, [])

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
      toast.success('Passwort geändert. Bitte neu anmelden.')
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
      <h1 className="text-2xl font-bold text-gray-900">Profil</h1>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Meine Daten</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <dt className="font-medium text-gray-500">Name</dt>
          <dd className="text-gray-900">{profile.firstName} {profile.lastName}</dd>
          <dt className="font-medium text-gray-500">E-Mail</dt>
          <dd className="text-gray-900">{profile.email}</dd>
          <dt className="font-medium text-gray-500">Rollen</dt>
          <dd className="flex flex-wrap gap-1">
            {profile.roles.map((r) => <RoleBadge key={r} role={r} />)}
          </dd>
          <dt className="font-medium text-gray-500">E-Mail verifiziert</dt>
          <dd className={profile.emailVerified ? 'text-green-600' : 'text-yellow-600'}>
            {profile.emailVerified ? 'Ja' : 'Nein'}
          </dd>
          {profile.lastLoginAt && (
            <>
              <dt className="font-medium text-gray-500">Letzter Login</dt>
              <dd className="text-gray-900">{formatDate(profile.lastLoginAt)}</dd>
            </>
          )}
          <dt className="font-medium text-gray-500">Konto erstellt</dt>
          <dd className="text-gray-900">{formatDate(profile.createdAt)}</dd>
        </dl>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Passwort ändern</h2>
        <p className="mb-4 text-sm text-gray-500">
          Nach der Änderung werden alle aktiven Sitzungen beendet.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorBanner error={apiError} />
          <Input
            label="Aktuelles Passwort"
            type="password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
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
          <Button type="submit" loading={isSubmitting}>
            Passwort speichern
          </Button>
        </form>
      </Card>
    </div>
  )
}
