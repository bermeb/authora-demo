import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui/Card'

export function AdminDashboardPage() {
  const { t } = useTranslation()

  const sections = [
    {
      to: '/admin/users',
      title: t('admin.dashboard.usersTitle'),
      description: t('admin.dashboard.usersDesc'),
    },
    {
      to: '/admin/audit-logs',
      title: t('admin.dashboard.logsTitle'),
      description: t('admin.dashboard.logsDesc'),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard.title')}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.to} to={s.to}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <h2 className="mb-1 text-base font-semibold text-indigo-700">{s.title}</h2>
              <p className="text-sm text-gray-600">{s.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
