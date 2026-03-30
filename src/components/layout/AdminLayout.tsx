import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'

export function AdminLayout() {
  const { t } = useTranslation()

  const links = [
    { to: '/admin', label: t('admin.nav.overview'), end: true },
    { to: '/admin/users', label: t('admin.nav.users'), end: false },
    { to: '/admin/audit-logs', label: t('admin.nav.auditLogs'), end: false },
  ]

  return (
    <div className="flex gap-6">
      <aside className="w-48 shrink-0">
        <nav className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Admin
          </p>
          {links.map((l) => (
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
              {l.label}
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
