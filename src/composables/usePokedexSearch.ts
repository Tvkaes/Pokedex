import { computed, ref } from 'vue'
import { usePokemonDataStore } from '@/stores/pokemonData'
import { usePokemonViewStore } from '@/stores/pokemonView'
import { POPULAR_POKEMON } from '@/utils/constants'

export function usePokedexSearch() {
  const dataStore = usePokemonDataStore()
  const viewStore = usePokemonViewStore()

  const searchValue = ref('')
  const isSearching = ref(false)
  const errorMessage = ref<string | null>(null)
  const toastMessage = ref<string | null>(null)
  let toastTimeout: ReturnType<typeof setTimeout> | null = null

  function setError(message: string) {
    errorMessage.value = message
    toastMessage.value = message
    if (toastTimeout) {
      clearTimeout(toastTimeout)
    }
    toastTimeout = setTimeout(() => {
      toastMessage.value = null
    }, 4000)
  }

  async function performSearch(query?: string) {
    const candidate = typeof query === 'string' ? query : searchValue.value
    const trimmed = candidate.trim()
    if (!trimmed) return

    isSearching.value = true
    errorMessage.value = null
    searchValue.value = trimmed

    try {
      await dataStore.loadPokemon(trimmed.toLowerCase())
      if (!dataStore.pokemon) {
        setError(dataStore.error ?? 'Pokémon not found. Please try a different name or number.')
        return
      }
      viewStore.setViewMode('hero')
    } catch (error) {
      setError('Search failed. Please try again.')
    } finally {
      isSearching.value = false
    }
  }

  async function searchRandomPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1
    isSearching.value = true
    errorMessage.value = null
    searchValue.value = ''

    try {
      await dataStore.loadPokemon(randomId)
      if (!dataStore.pokemon) {
        setError(dataStore.error ?? 'Random search failed. Please try again.')
        return
      }
      viewStore.setViewMode('hero')
    } catch (error) {
      setError('Random search failed. Please try again.')
    } finally {
      isSearching.value = false
    }
  }

  const activeError = computed(() => errorMessage.value)
  const suggestionPool = computed(() => {
    const entries = dataStore.getGenerationEntries(viewStore.activeGeneration) ?? []
    if (!entries.length) return POPULAR_POKEMON
    return entries.map((entry) => entry.name)
  })

  function dismissToast() {
    toastMessage.value = null
    if (toastTimeout) {
      clearTimeout(toastTimeout)
      toastTimeout = null
    }
  }

  return {
    searchValue,
    isSearching,
    activeError,
    suggestionPool,
    toastMessage,
    performSearch,
    searchRandomPokemon,
    dismissToast,
  }
}
