import { computed, ref } from 'vue'
import { fetchPokemon, fetchPokemonSpecies } from '@/utils/api'
import { DEFAULT_POKEMON } from '@/utils/constants'
import { formatPokemonId, formatPokemonName, extractDescription, extractGenus, mapStats } from '@/utils/helpers'
import type { PokemonData, PokemonDisplayData } from '@/types/pokemon.types'

export function usePokemonData() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pokemon = ref<PokemonDisplayData | null>(null)
  const rawPokemon = ref<PokemonData | null>(null)
  const currentType = ref<string>('electric')

  async function loadPokemon(identifier: string | number = DEFAULT_POKEMON) {
    if (!identifier) return
    try {
      isLoading.value = true
      error.value = null

      const data = await fetchPokemon(identifier)
      const species = await fetchPokemonSpecies(identifier)

      rawPokemon.value = data
      currentType.value = data.types?.[0]?.type?.name ?? 'normal'

      pokemon.value = {
        id: data.id,
        formattedId: formatPokemonId(data.id),
        name: formatPokemonName(data.name),
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
          '',
        spriteShiny:
          data.sprites?.other?.['official-artwork']?.front_shiny ??
          data.sprites?.other?.home?.front_shiny ??
          data.sprites?.front_shiny ??
          null
      }
    } catch (err) {
      error.value = 'Pokémon no encontrado. Intenta con otro nombre o número.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const primaryType = computed(() => currentType.value)

  return {
    isLoading,
    error,
    pokemon,
    primaryType,
    loadPokemon,
  }
}
