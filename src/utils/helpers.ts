import type {
  PokemonData,
  PokemonDisplayData,
  PokemonFeaturedAbility,
  PokemonSpeciesData,
} from '@/types/pokemon.types'
import { STAT_LABELS } from './constants'

/**
 * Capitalizes the first letter of the Pokémon name to keep labels consistent.
 */
export function formatPokemonName(name: string): string {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Pads the Pokémon id (#001) so it matches Pokédex formatting.
 */
export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

/**
 * Picks the first English flavor text entry available from the species data.
 */
export function extractDescription(species?: PokemonSpeciesData): string {
  if (!species?.flavor_text_entries?.length) return ''
  const entry = species.flavor_text_entries.find((item) => item.language.name === 'en')
  if (!entry) return ''
  return entry.flavor_text.replace(/\f|\n|\r/g, ' ').trim()
}

/**
 * Retrieves the English genus (e.g., "Seed Pokémon") for display.
 */
export function extractGenus(species?: PokemonSpeciesData): string {
  if (!species?.genera?.length) return ''
  const genus = species.genera.find((item) => item.language.name === 'en')
  return genus?.genus ?? ''
}

/**
 * Returns the Japanese name when available to enhance the hero background label.
 */
export function extractNativeName(species?: PokemonSpeciesData): string {
  if (!species?.names?.length) return ''
  const japanese = species.names.find((item) => item.language.name === 'ja-Hrkt')
  return japanese?.name ?? ''
}

/**
 * Maps API stats into label/value/percentage objects used by the progress bars.
 */
export function mapStats(pokemon: PokemonData): PokemonDisplayData['stats'] {
  return pokemon.stats.map((stat) => {
    const label = STAT_LABELS[stat.stat.name] ?? stat.stat.name.toUpperCase()
    const value = stat.base_stat
    const percentage = Math.min((value / 255) * 100, 100)
    return { label, value, percentage }
  })
}

export function selectFeaturedAbility(pokemon: PokemonData): PokemonFeaturedAbility | null {
  if (!pokemon.abilities?.length) return null
  const preferred = pokemon.abilities.find((ability) => !ability.is_hidden) ?? pokemon.abilities[0]
  const slug = preferred?.ability?.name
  if (!slug) return null
  return {
    name: formatPokemonName(slug.replace('-', ' ')),
    slug,
    isHidden: preferred.is_hidden,
  }
}
