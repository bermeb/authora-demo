import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { allAuditLogs, userAuditLogs } from '../../api/admin'
import { Card } from '../../components/ui/Card'
import { EventTypeBadge } from '../../components/ui/Badge'
import { Pagination } from '../../components/ui/Pagination'
import { FullPageSpinner } from '../../components/ui/Spinner'
import { formatDate } from '../../lib/utils'
import type { PaginatedAuditLog } from '../../types/api'

export function AuditLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<PaginatedAuditLog | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userIdInput, setUserIdInput] = useState(searchParams.get('userId') ?? '')
  const [activeUserId, setActiveUserId] = useState(searchParams.get('userId') ?? '')

  const load = useCallback(
    async (p: number, uid: string) => {
      setLoading(true)
      try {
        setData(uid ? await userAuditLogs(uid, p, 50) : await allAuditLogs(p, 50))
      } catch {
        toast.error('Logs konnten nicht geladen werden.')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    void load(page, activeUserId)
  }, [load, page, activeUserId])

  function handleFilter(e: React.FormEvent) {
    e.preventDefault()
    setPage(0)
    setActiveUserId(userIdInput.trim())
    if (userIdInput.trim()) {
      setSearchParams({ userId: userIdInput.trim() })
    } else {
      setSearchParams({})
    }
  }

  if (loading && !data) return <FullPageSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Audit-Logs</h1>
        {data && (
          <span className="text-sm text-gray-500">{data.totalElements} Einträge</span>
        )}
      </div>

      <Card>
        <form onSubmit={handleFilter} className="flex gap-2">
          <input
            type="text"
            placeholder="User-ID filtern (leer = alle)"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Filtern
          </button>
          {activeUserId && (
            <button
              type="button"
              onClick={() => {
                setUserIdInput('')
                setActiveUserId('')
                setSearchParams({})
                setPage(0)
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Zurücksetzen
            </button>
          )}
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Zeitpunkt', 'Ereignis', 'Benutzer', 'IP-Adresse', 'Details'].map((h) => (
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
              {data?.content.map((entry) => (
                <tr key={entry.id} className={entry.failed ? 'bg-red-50' : ''}>
                  <td className="whitespace-nowrap px-4 py-2.5 text-xs text-gray-500">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-2.5">
                    <EventTypeBadge type={entry.eventType} />
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 text-xs">
                    {entry.userEmail ?? <span className="text-gray-400">–</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-gray-500">
                    {entry.ipAddress}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 max-w-xs truncate">
                    {entry.details ?? '–'}
                  </td>
                </tr>
              ))}
              {data?.content.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                    Keine Einträge gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data && (
          <div className="px-4 py-3">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
