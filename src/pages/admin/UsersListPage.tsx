import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      setData(await listUsers(p, 20))
    } catch {
      toast.error('Benutzer konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load(page) }, [load, page])

  async function toggleLock(user: AdminUserView) {
    try {
      await setLock(user.id, !user.accountLocked)
      toast.success(user.accountLocked ? 'Entsperrt.' : 'Gesperrt.')
      void load(page)
    } catch {
      toast.error('Aktion fehlgeschlagen.')
    }
  }

  async function toggleEnabled(user: AdminUserView) {
    try {
      await setEnabled(user.id, !user.enabled)
      toast.success(user.enabled ? 'Deaktiviert.' : 'Aktiviert.')
      void load(page)
    } catch {
      toast.error('Aktion fehlgeschlagen.')
    }
  }

  if (loading && !data) return <FullPageSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Benutzer</h1>
        {data && (
          <span className="text-sm text-gray-500">{data.totalElements} gesamt</span>
        )}
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'E-Mail', 'Rollen', 'Aktiv', 'Gesperrt', 'Erstellt', ''].map((h) => (
                  <th
                    key={h}
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
                      {user.enabled ? 'Aktiv' : 'Inaktiv'}
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
                      {user.accountLocked ? 'Gesperrt' : 'Entsperrt'}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-indigo-600 hover:underline text-xs">
                    Details
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
