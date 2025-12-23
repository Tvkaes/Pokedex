import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPokemon, fetchPokemonSpecies } from '@/utils/api'
import { DEFAULT_POKEMON } from '@/utils/constants'
import { formatPokemonId, formatPokemonName, extractDescription, extractGenus, extractNativeName, mapStats } from '@/utils/helpers'
import type { PokemonDisplayData } from '@/types/pokemon.types'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemon = ref<PokemonDisplayData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const primaryType = ref<string>('electric')

  async function loadPokemon(identifier: string | number = DEFAULT_POKEMON) {
    if (!identifier) return
    try {
      isLoading.value = true
      error.value = null

      const [data, species] = await Promise.all([
        fetchPokemon(identifier),
        fetchPokemonSpecies(identifier)
      ])

      primaryType.value = data.types?.[0]?.type?.name ?? 'normal'

      pokemon.value = {
        id: data.id,
        formattedId: formatPokemonId(data.id),
        name: formatPokemonName(data.name),
        nativeName: extractNativeName(species),
        description: extractDescription(species),
        genus: extractGenus(species),
        stats: mapStats(data),
        types: data.types,
        abilities: data.abilities,
        height: data.height / 10,
        weight: data.weight / 10,
        sprite:
          data.sprites?.other?.['official-artwork']?.front_default ??
          data.sprites?.other?.home?.front_default ??
          data.sprites?.front_default ??
          ''
      }
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
