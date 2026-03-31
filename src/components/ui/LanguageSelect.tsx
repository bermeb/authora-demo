import { useTranslation } from 'react-i18next'
import { LANG_STORAGE_KEY, LANGUAGES, type Language } from '../../i18n'

const VALID_CODES = LANGUAGES.map(l => l.code)

export function LanguageSelect() {
  const { i18n } = useTranslation()

  function handleChange(value: string) {
    if (!VALID_CODES.includes(value as Language)) return
    const code = value as Language
    i18n.changeLanguage(code)
    localStorage.setItem(LANG_STORAGE_KEY, code)
  }

  return (
    <select
      value={i18n.language}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
    </select>
  )
}
