import {useTranslation} from 'react-i18next'
import type {ProblemDetail} from '../../types/api'

interface ErrorBannerProps {
    error: ProblemDetail | string | null
}

export function ErrorBanner({error}: ErrorBannerProps) {
    const {t} = useTranslation()

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
            <p className="font-medium">{error.detail ?? error.title ?? t('errors.defaultTitle')}</p>
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