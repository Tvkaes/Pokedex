import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_POKEMON } from '@/utils/constants'
import { DEFAULT_GENERATION_ID } from '@pokedex/data/generations'
import type { PokemonDisplayData, PokemonGridEntry } from '@/types/pokemon.types'
import { getGenerationGridEntries, getPokemonDetails } from '@/services/pokemonService'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemon = ref<PokemonDisplayData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const primaryType = ref<string>('electric')
  const viewMode = ref<'hero' | 'grid'>('hero')
  const activeGeneration = ref<string>(DEFAULT_GENERATION_ID)
  const generationEntries = ref<Record<string, PokemonGridEntry[]>>({})
  const isGenerationLoading = ref(false)

  /**
   * Loads Pokémon data (base + species) and maps it into the UI-friendly structure.
   */
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

  /**
   * Switches between hero (single Pokémon) and grid (gallery) view.
   */
  function setViewMode(mode: 'hero' | 'grid') {
    viewMode.value = mode
  }

  /**
   * Changes the active generation filter.
   */
  function setActiveGeneration(id: string) {
    if (activeGeneration.value === id) return
    activeGeneration.value = id
  }

  /**
   * Fetches and caches lightweight entries for the selected generation to power the grid layout.
   */
  async function loadGenerationEntries(id: string) {
    if (generationEntries.value[id]) return
    try {
      isGenerationLoading.value = true
      error.value = null
      const entries = await getGenerationGridEntries(id)
      generationEntries.value = {
        ...generationEntries.value,
        [id]: entries,
      }
    } catch (err) {
      console.error(err)
      error.value = 'Generation could not load. Please try again.'
    } finally {
      isGenerationLoading.value = false
    }
  }

  return {
    pokemon,
    isLoading,
    error,
    primaryType,
    viewMode,
    activeGeneration,
    generationEntries,
    isGenerationLoading,
    loadPokemon,
    setViewMode,
    setActiveGeneration,
    loadGenerationEntries,
  }
})
