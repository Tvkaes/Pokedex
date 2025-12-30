import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_POKEMON } from '@/utils/constants'
import type { PokemonDisplayData, PokemonGridEntry } from '@/types/pokemon.types'
import { getGenerationGridEntries, getPokemonDetails } from '@/services/pokemonService'

const CACHE_TTL = 1000 * 60 * 5

export const usePokemonDataStore = defineStore('pokemon-data', () => {
  const pokemon = ref<PokemonDisplayData | null>(null)
  const primaryType = ref<string>('electric')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const generationEntries = ref<Record<string, PokemonGridEntry[]>>({})
  const generationEntryTimestamps = ref<Record<string, number>>({})
  const isGenerationLoading = ref(false)

  async function loadPokemon(identifier: string | number = DEFAULT_POKEMON) {
    if (!identifier) return
    try {
      isLoading.value = true
      error.value = null
      const { display, primaryType: type } = await getPokemonDetails(identifier)
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

  function getGenerationEntries(id: string) {
    return generationEntries.value[id] ?? []
  }

  async function loadGenerationEntries(id: string, options: { forceRefresh?: boolean } = {}) {
    const { forceRefresh = false } = options
    const cachedEntries = generationEntries.value[id]
    const timestamp = generationEntryTimestamps.value[id]
    const isFresh = Boolean(timestamp) && Date.now() - (timestamp ?? 0) < CACHE_TTL

    if (!forceRefresh && cachedEntries && isFresh) {
      return cachedEntries
    }
    try {
      isGenerationLoading.value = true
      error.value = null
      const entries = await getGenerationGridEntries(id)
      generationEntries.value = {
        ...generationEntries.value,
        [id]: entries,
      }
      generationEntryTimestamps.value = {
        ...generationEntryTimestamps.value,
        [id]: Date.now(),
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
    loadPokemon,
    loadGenerationEntries,
    getGenerationEntries,
  }
})
