import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { de } from './locales/de'

export type Language = 'en' | 'de'
export const LANG_STORAGE_KEY = 'authora-lang'
export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
]

const VALID_LANGS = LANGUAGES.map(l => l.code)
const rawSaved = localStorage.getItem(LANG_STORAGE_KEY)
const saved: Language | null = VALID_LANGS.includes(rawSaved as Language) ? (rawSaved as Language) : null

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, de: { translation: de } },
  lng: saved ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
