import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'shivyoga_lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en'
    } catch {
      return 'mr'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore storage errors */
    }
    document.documentElement.lang = lang === 'mr' ? 'mr' : 'en'
  }, [lang])

  function toggleLang() {
    setLang((l) => (l === 'mr' ? 'en' : 'mr'))
  }

  // t(key) looks up the key in the translations dictionary and returns the
  // string for the active language, falling back to Marathi, then the key.
  function t(key) {
    const entry = translations[key]
    if (!entry) return key
    return entry[lang] ?? entry.mr ?? key
  }

  // pick(marathiValue, englishValue) — for inline data (e.g. product desc)
  function pick(mr, en) {
    if (lang === 'en') return en || mr
    return mr
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, pick }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
