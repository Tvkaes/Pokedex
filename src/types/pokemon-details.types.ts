import type { PokemonDisplayData, PokemonSpeciesData, PokemonData } from '@/types/pokemon.types'

export interface PokemonDetails {
  primaryType: string
  raw: PokemonData
  species: PokemonSpeciesData
  display: PokemonDisplayData
}
