import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_POKEMON } from '@/utils/constants'
import type { PokemonDisplayData } from '@/types/pokemon.types'
import { getPokemonDetails } from '@/services/pokemonService'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemon = ref<PokemonDisplayData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const primaryType = ref<string>('electric')

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
      error.value = 'Pokémon no encontrado. Intenta con otro nombre o número.'
      pokemon.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    pokemon,
    isLoading,
    error,
    primaryType,
    loadPokemon,
  }
})
