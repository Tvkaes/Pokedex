import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { translations, type Locale, type TranslationKey } from '@/locales/translations'

const STORAGE_KEY = 'pokedex-locale'

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const browserLang = navigator.language?.toLowerCase() ?? ''
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('ja')) return 'ja'
  return 'en'
}

function loadStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'es' || stored === 'ja') {
    return stored
  }
  return detectBrowserLocale()
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>(loadStoredLocale())

  const availableLocales: Locale[] = ['en', 'es', 'ja']

  function setLocale(newLocale: Locale) {
    locale.value = newLocale
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  function t(key: TranslationKey): string {
    return translations[locale.value][key] ?? key
  }

  const currentLocale = computed(() => locale.value)

  return {
    locale,
    currentLocale,
    availableLocales,
    setLocale,
    t,
  }
})
