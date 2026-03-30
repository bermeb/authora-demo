import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { listUsers, setLock, setEnabled } from '../../api/admin'
import { Card } from '../../components/ui/Card'
import { RoleBadge } from '../../components/ui/Badge'
import { Pagination } from '../../components/ui/Pagination'
import { FullPageSpinner } from '../../components/ui/Spinner'
import { formatDate } from '../../lib/utils'
import type { AdminUserView, PaginatedUserResponse } from '../../types/api'

export function UsersListPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<PaginatedUserResponse | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      setData(await listUsers(p, 20))
    } catch {
      toast.error(t('admin.users.toastFailed'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { void load(page) }, [load, page])

  async function toggleLock(user: AdminUserView) {
    try {
      await setLock(user.id, !user.accountLocked)
      toast.success(user.accountLocked ? t('admin.users.toastUnlocked') : t('admin.users.toastLocked'))
      void load(page)
    } catch {
      toast.error(t('admin.users.toastFailed'))
    }
  }

  async function toggleEnabled(user: AdminUserView) {
    try {
      await setEnabled(user.id, !user.enabled)
      toast.success(user.enabled ? t('admin.users.toastDeactivated') : t('admin.users.toastActivated'))
      void load(page)
    } catch {
      toast.error(t('admin.users.toastFailed'))
    }
  }

  if (loading && !data) return <FullPageSpinner />

  const headers = [
    t('admin.users.columns.name'),
    t('admin.users.columns.email'),
    t('admin.users.columns.roles'),
    t('admin.users.columns.active'),
    t('admin.users.columns.locked'),
    t('admin.users.columns.created'),
    '',
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.users.title')}</h1>
        {data && (
          <span className="text-sm text-gray-500">
            {t('admin.users.total', { count: data.totalElements })}
          </span>
        )}
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data?.content.map((user) => (
                <tr
                  key={user.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r) => <RoleBadge key={r} role={r} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); void toggleEnabled(user) }}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.enabled
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.enabled ? t('admin.users.active') : t('admin.users.inactive')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); void toggleLock(user) }}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.accountLocked
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {user.accountLocked ? t('admin.users.locked') : t('admin.users.unlocked')}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-indigo-600 hover:underline text-xs">
                    {t('admin.users.details')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && (
          <div className="px-4 py-3">
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
