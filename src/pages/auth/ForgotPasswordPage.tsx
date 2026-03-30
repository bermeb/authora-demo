import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { forgotPassword } from '../../api/password'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

const schema = z.object({ email: z.string().email('Ungültige E-Mail-Adresse') })
type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      await forgotPassword(data.email)
    } catch {
      // Anti-enumeration: always show success
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">📬</div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">E-Mail gesendet</h2>
          <p className="text-sm text-gray-600">
            Falls diese Adresse registriert ist, erhältst du in Kürze eine E-Mail mit einem
            Reset-Link.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
          >
            Zur Anmeldung
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <h1 className="mb-2 text-xl font-bold text-gray-900">Passwort vergessen</h1>
        <p className="mb-6 text-sm text-gray-600">
          Gib deine E-Mail-Adresse ein. Wir schicken dir einen Reset-Link.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-Mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Reset-Link senden
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Zurück zur Anmeldung
          </Link>
        </p>
      </Card>
    </div>
  )
}
