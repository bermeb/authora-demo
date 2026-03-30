import type { ProblemDetail } from '../../types/api'

interface ErrorBannerProps {
  error: ProblemDetail | string | null
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null

  if (typeof error === 'string') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <p className="font-medium">{error.detail ?? error.title ?? 'Ein Fehler ist aufgetreten.'}</p>
      {error.errors && Object.keys(error.errors).length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {Object.entries(error.errors).map(([field, msg]) => (
            <li key={field}>
              <span className="font-medium">{field}:</span> {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function extractProblemDetail(err: unknown): ProblemDetail {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response
  ) {
    return err.response.data as ProblemDetail
  }
  return { status: 500, detail: 'Ein unbekannter Fehler ist aufgetreten.' }
}
