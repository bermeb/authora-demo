import type { AuditEventType } from '../types/api'

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function eventTypeColor(type: AuditEventType): string {
  const green: AuditEventType[] = [
    'LOGIN_SUCCESS',
    'REGISTRATION',
    'EMAIL_VERIFICATION',
    'ACCOUNT_UNLOCKED',
    'ACCOUNT_ENABLED',
    'PASSWORD_RESET_COMPLETED',
  ]
  const yellow: AuditEventType[] = [
    'LOGIN_FAILURE',
    'RATE_LIMIT_EXCEEDED',
    'INVALID_TOKEN',
    'PASSWORD_RESET_REQUESTED',
  ]
  const red: AuditEventType[] = [
    'ACCOUNT_LOCKED',
    'ACCOUNT_DISABLED',
    'SUSPICIOUS_ACTIVITY',
    'USER_DELETED',
  ]
  if (green.includes(type)) return 'bg-green-100 text-green-800'
  if (yellow.includes(type)) return 'bg-yellow-100 text-yellow-800'
  if (red.includes(type)) return 'bg-red-100 text-red-800'
  return 'bg-blue-100 text-blue-800'
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}
