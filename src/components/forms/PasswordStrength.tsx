import { cn } from '../../lib/utils'

interface Check {
  label: string
  ok: boolean
}

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const checks: Check[] = [
    { label: 'Mindestens 12 Zeichen', ok: password.length >= 12 },
    { label: 'Großbuchstabe', ok: /[A-Z]/.test(password) },
    { label: 'Kleinbuchstabe', ok: /[a-z]/.test(password) },
    { label: 'Ziffer', ok: /\d/.test(password) },
    { label: 'Sonderzeichen', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const passed = checks.filter((c) => c.ok).length
  const strengthColor =
    passed <= 2 ? 'bg-red-400' : passed <= 3 ? 'bg-yellow-400' : 'bg-green-400'

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={cn('h-1.5 rounded-full transition-all', strengthColor)}
          style={{ width: `${(passed / checks.length) * 100}%` }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn('text-xs', c.ok ? 'text-green-600' : 'text-gray-400')}
          >
            {c.ok ? '✓' : '○'} {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
