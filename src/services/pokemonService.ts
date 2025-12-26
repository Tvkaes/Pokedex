import { fetchPokemon, fetchPokemonSpecies } from '@/utils/api'
import { formatPokemonId, formatPokemonName, extractDescription, extractGenus, extractNativeName, mapStats } from '@/utils/helpers'
import type { PokemonDetails } from '@/types/pokemon-details.types'
import type { PokemonData } from '@/types/pokemon.types'

function mapDisplayData(data: PokemonData, speciesData: Awaited<ReturnType<typeof fetchPokemonSpecies>>): PokemonDetails['display'] {
  return {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: formatPokemonName(data.name),
    nativeName: extractNativeName(speciesData),
    description: extractDescription(speciesData),
    genus: extractGenus(speciesData),
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
      null,
    cryUrl: data.cries?.latest ?? data.cries?.legacy ?? undefined,
  }
}

/**
 * Fetches every data source needed to display a Pokémon and returns raw+formatted information.
 */
export async function getPokemonDetails(identifier: string | number): Promise<PokemonDetails> {
  const [data, species] = await Promise.all([fetchPokemon(identifier), fetchPokemonSpecies(identifier)])
  const primaryType = data.types?.[0]?.type?.name ?? 'normal'

  return {
    primaryType,
    raw: data,
    species,
    display: mapDisplayData(data, species),
  }
}
