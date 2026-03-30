import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'

const sections = [
  {
    to: '/admin/users',
    title: 'Benutzerverwaltung',
    description: 'Alle Benutzer anzeigen, sperren, aktivieren und Rollen verwalten.',
  },
  {
    to: '/admin/audit-logs',
    title: 'Audit-Logs',
    description: 'Sicherheitsereignisse und Aktivitäten aller Benutzer einsehen.',
  },
]

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin-Bereich</h1>
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
