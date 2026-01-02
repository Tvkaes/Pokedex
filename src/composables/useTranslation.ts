import { useLocaleStore } from '@/stores/locale'
import { storeToRefs } from 'pinia'

export function useTranslation() {
  const localeStore = useLocaleStore()
  const { currentLocale } = storeToRefs(localeStore)
  const availableLocales = localeStore.availableLocales

  return {
    t: localeStore.t,
    locale: currentLocale,
    availableLocales,
    setLocale: localeStore.setLocale,
  }
}
