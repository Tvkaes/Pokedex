import { computed, type ComputedRef } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'

/**
 * Provides derived labels and unit conversions for a Pokémon to keep UI templates clean.
 */
export function usePokemonFormatting(pokemon: ComputedRef<PokemonDisplayData>) {
  const backgroundLabel = computed(() => pokemon.value.nativeName ?? pokemon.value.name.toUpperCase())

  const imperialHeight = computed(() => {
    const meters = pokemon.value.height
    const totalInches = meters * 39.3701
    const feet = Math.floor(totalInches / 12)
    const inches = Math.round(totalInches % 12)
    return `${feet}' ${inches}"`
  })

  const imperialWeight = computed(() => {
    const kg = pokemon.value.weight
    const lbs = kg * 2.20462
    return `${Math.round(lbs)} lbs`
  })

  return {
    backgroundLabel,
    imperialHeight,
    imperialWeight,
  }
}
