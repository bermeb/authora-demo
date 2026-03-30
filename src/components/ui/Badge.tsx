import { cn } from '../../lib/utils'
import { eventTypeColor } from '../../lib/utils'
import type { AuditEventType, Role } from '../../types/api'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function RoleBadge({ role }: { role: Role }) {
  const colors: Record<Role, string> = {
    ADMIN: 'bg-purple-100 text-purple-800',
    USER: 'bg-gray-100 text-gray-700',
  }
  return <Badge className={colors[role]}>{role}</Badge>
}

export function EventTypeBadge({ type }: { type: AuditEventType }) {
  return <Badge className={eventTypeColor(type)}>{type.replace(/_/g, ' ')}</Badge>
}
