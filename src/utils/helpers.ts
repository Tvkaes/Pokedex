import type { PokemonData, PokemonDisplayData, PokemonSpeciesData } from '@/types/pokemon.types'
import { STAT_LABELS } from './constants'

export function formatPokemonName(name: string): string {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function extractDescription(species?: PokemonSpeciesData): string {
  if (!species?.flavor_text_entries?.length) return ''
  const entry = species.flavor_text_entries.find((item) => item.language.name === 'en')
  if (!entry) return ''
  return entry.flavor_text.replace(/\f|\n|\r/g, ' ').trim()
}

export function extractGenus(species?: PokemonSpeciesData): string {
  if (!species?.genera?.length) return ''
  const genus = species.genera.find((item) => item.language.name === 'en')
  return genus?.genus ?? ''
}

export function extractNativeName(species?: PokemonSpeciesData): string {
  if (!species?.names?.length) return ''
  const japanese = species.names.find((item) => item.language.name === 'ja-Hrkt')
  return japanese?.name ?? ''
}

export function mapStats(pokemon: PokemonData): PokemonDisplayData['stats'] {
  return pokemon.stats.map((stat) => {
    const label = STAT_LABELS[stat.stat.name] ?? stat.stat.name.toUpperCase()
    const value = stat.base_stat
    const percentage = Math.min((value / 255) * 100, 100)
    return { label, value, percentage }
  })
}
