import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import i18n from '../../i18n'
import {
  getUser,
  setLock,
  setEnabled,
  assignRole,
  removeRole,
  revokeSessions,
} from '../../api/admin'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { RoleBadge } from '../../components/ui/Badge'
import { FullPageSpinner } from '../../components/ui/Spinner'
import { formatDate } from '../../lib/utils'
import type { AdminUserView } from '../../types/api'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<AdminUserView | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const { t } = useTranslation()

  const load = useCallback(async () => {
    if (!id) return
    try {
      setUser(await getUser(id))
    } catch {
      toast.error(i18n.t('admin.userDetail.toastFailed'))
      navigate('/admin/users')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => { void load() }, [load])

  async function action(fn: () => Promise<unknown>, successMsg: string) {
    setBusy(true)
    try {
      await fn()
      toast.success(successMsg)
      void load()
    } catch {
      toast.error(t('admin.userDetail.toastFailed'))
    } finally {
      setBusy(false)
    }
  }

  if (loading || !user) return <FullPageSpinner />

  const isAdmin = user.roles.includes('ADMIN')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/users" className="text-sm text-indigo-600 hover:underline">
          {t('admin.userDetail.back')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-800">{t('admin.userDetail.userData')}</h2>
          <dl className="space-y-2 text-sm">
            {[
              [t('admin.userDetail.id'), <span className="font-mono text-xs text-gray-500">{user.id}</span>],
              [t('admin.userDetail.email'), user.email],
              [t('admin.userDetail.emailVerified'), user.emailVerified ? t('admin.userDetail.active') : t('admin.userDetail.inactive')],
              [t('admin.userDetail.oauthProvider'), user.oauthProvider ?? '–'],
              [t('admin.userDetail.failedAttempts'), user.failedLoginAttempts],
              [t('admin.userDetail.createdAt'), formatDate(user.createdAt)],
              [t('admin.userDetail.lastLogin'), user.lastLoginAt ? formatDate(user.lastLoginAt) : '–'],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between gap-4">
                <dt className="font-medium text-gray-500">{k}</dt>
                <dd className="text-right text-gray-900">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-gray-500">{t('admin.userDetail.roles')}</dt>
              <dd className="flex flex-wrap justify-end gap-1">
                {user.roles.map((r) => <RoleBadge key={r} role={r} />)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-800">{t('admin.userDetail.status')}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('admin.userDetail.status')}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {user.enabled ? t('admin.userDetail.active') : t('admin.userDetail.inactive')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('admin.userDetail.accountLocked')}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.accountLocked
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {user.accountLocked ? t('admin.userDetail.accountLocked') : t('admin.userDetail.accountUnlocked')}
              </span>
            </div>
            {user.lockedUntil && (
              <p className="text-xs text-gray-500">
                {t('admin.userDetail.lockedUntil', { date: formatDate(user.lockedUntil) })}
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-800">{t('admin.userDetail.actions')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={user.accountLocked ? 'ghost' : 'danger'}
            loading={busy}
            onClick={() =>
              action(
                () => setLock(user.id, !user.accountLocked),
                user.accountLocked ? t('admin.userDetail.toastUnlocked') : t('admin.userDetail.toastLocked'),
              )
            }
          >
            {user.accountLocked ? t('admin.userDetail.unlockUser') : t('admin.userDetail.lockUser')}
          </Button>
          <Button
            variant={user.enabled ? 'danger' : 'ghost'}
            loading={busy}
            onClick={() =>
              action(
                () => setEnabled(user.id, !user.enabled),
                user.enabled ? t('admin.userDetail.toastDeactivated') : t('admin.userDetail.toastActivated'),
              )
            }
          >
            {user.enabled ? t('admin.userDetail.deactivate') : t('admin.userDetail.activate')}
          </Button>
          <Button
            variant={isAdmin ? 'danger' : 'ghost'}
            loading={busy}
            onClick={() =>
              action(
                () => (isAdmin ? removeRole(user.id, 'ADMIN') : assignRole(user.id, 'ADMIN')),
                isAdmin ? t('admin.userDetail.toastAdminRemoved') : t('admin.userDetail.toastAdminAssigned'),
              )
            }
          >
            {isAdmin ? t('admin.userDetail.removeAdmin') : t('admin.userDetail.assignAdmin')}
          </Button>
          <Button
            variant="danger"
            loading={busy}
            onClick={() =>
              action(() => revokeSessions(user.id), t('admin.userDetail.toastSessionsRevoked'))
            }
          >
            {t('admin.userDetail.revokeSessions')}
          </Button>
          <Link to={`/admin/audit-logs?userId=${user.id}`}>
            <Button variant="ghost">{t('admin.userDetail.viewAuditLog')}</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
