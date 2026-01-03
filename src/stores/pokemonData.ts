import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { DEFAULT_POKEMON } from '@/utils/constants'
import type { PokemonDisplayData, PokemonGridEntry } from '@/types/pokemon.types'
import { getGenerationGridEntries, getPokemonDetails } from '@/services/pokemonService'
import { useLocaleStore } from '@/stores/locale'
import type { Locale } from '@/locales/translations'

const CACHE_TTL = 1000 * 60 * 5

export const usePokemonDataStore = defineStore('pokemon-data', () => {
  const localeStore = useLocaleStore()
  const { currentLocale } = storeToRefs(localeStore)
  const pokemon = ref<PokemonDisplayData | null>(null)
  const primaryType = ref<string>('electric')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const generationEntries = ref<Record<string, PokemonGridEntry[]>>({})
  const generationEntryTimestamps = ref<Record<string, number>>({})
  const isGenerationLoading = ref(false)

  function resolveLocale(locale?: Locale) {
    return locale ?? currentLocale.value
  }

  async function loadPokemon(identifier: string | number = DEFAULT_POKEMON, options: { locale?: Locale } = {}) {
    const locale = resolveLocale(options.locale)
    if (!identifier) return
    try {
      isLoading.value = true
      error.value = null
      const { display, primaryType: type } = await getPokemonDetails(identifier, locale)
      primaryType.value = type
      pokemon.value = display
    } catch (err) {
      console.error(err)
      error.value = 'Pokémon not found. Try another name or number.'
      pokemon.value = null
    } finally {
      isLoading.value = false
    }
  }

  function getGenerationEntries(id: string, locale?: Locale) {
    const cacheKey = `${id}::${resolveLocale(locale)}`
    return generationEntries.value[cacheKey] ?? []
  }

  watch(
    () => currentLocale.value,
    (newLocale, oldLocale) => {
      if (newLocale === oldLocale) return
      generationEntries.value = {}
      generationEntryTimestamps.value = {}
      if (pokemon.value?.id) {
        void loadPokemon(pokemon.value.id, { locale: newLocale })
      } else {
        void loadPokemon(DEFAULT_POKEMON, { locale: newLocale })
      }
    }
  )

  async function loadGenerationEntries(id: string, options: { forceRefresh?: boolean; locale?: Locale } = {}) {
    const { forceRefresh = false } = options
    const locale = resolveLocale(options.locale)
    const cacheKey = `${id}::${locale}`
    const cachedEntries = generationEntries.value[cacheKey]
    const timestamp = generationEntryTimestamps.value[cacheKey]
    const isFresh = Boolean(timestamp) && Date.now() - (timestamp ?? 0) < CACHE_TTL

    if (!forceRefresh && cachedEntries && isFresh) {
      return cachedEntries
    }
    try {
      isGenerationLoading.value = true
      error.value = null
      const entries = await getGenerationGridEntries(id, locale)
      generationEntries.value = {
        ...generationEntries.value,
        [cacheKey]: entries,
      }
      generationEntryTimestamps.value = {
        ...generationEntryTimestamps.value,
        [cacheKey]: Date.now(),
      }
      return entries
    } catch (err) {
      console.error(err)
      error.value = 'Generation could not load. Please try again.'
      return []
    } finally {
      isGenerationLoading.value = false
    }
  }

  return {
    pokemon,
    primaryType,
    isLoading,
    isGenerationLoading,
    error,
    generationEntries,
    loadPokemon,
    loadGenerationEntries,
    getGenerationEntries,
  }
})
