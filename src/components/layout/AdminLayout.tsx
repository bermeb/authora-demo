import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/admin', key: 'admin.nav.overview' as const, end: true },
  { to: '/admin/users', key: 'admin.nav.users' as const, end: false },
  { to: '/admin/audit-logs', key: 'admin.nav.auditLogs' as const, end: false },
]

export function AdminLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex gap-6">
      <aside className="w-48 shrink-0">
        <nav className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Admin
          </p>
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
