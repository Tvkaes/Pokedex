import type {
  PokemonData,
  PokemonDisplayData,
  PokemonFeaturedAbility,
  PokemonSpeciesData,
} from '@/types/pokemon.types'
import type { Locale } from '@/locales/translations'
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

const LANGUAGE_PREFERENCE: Record<Locale, string[]> = {
  en: ['en'],
  es: ['es', 'es-la'],
  ja: ['ja-Hrkt', 'ja'],
}

function buildLanguagePriority(locale: Locale): string[] {
  const primary = LANGUAGE_PREFERENCE[locale] ?? LANGUAGE_PREFERENCE.en
  const fallback = LANGUAGE_PREFERENCE.en
  const merged = [...primary, ...fallback]
  return Array.from(new Set(merged))
}

function findByLanguage<T extends { language?: { name?: string } }>(entries: T[] | undefined, locale: Locale): T | undefined {
  if (!entries?.length) return undefined
  const priorityOrder = buildLanguagePriority(locale)
  for (const code of priorityOrder) {
    const match = entries.find((item) => item.language?.name === code)
    if (match) {
      return match
    }
  }
  return undefined
}

/**
 * Picks the first localized flavor text entry available from the species data.
 */
export function extractDescription(species: PokemonSpeciesData | undefined, locale: Locale = 'en'): string {
  const entry = findByLanguage(species?.flavor_text_entries, locale)
  if (!entry) return ''
  return entry.flavor_text.replace(/\f|\n|\r/g, ' ').trim()
}

/**
 * Retrieves the localized genus (e.g., "Seed Pokémon") for display.
 */
export function extractGenus(species: PokemonSpeciesData | undefined, locale: Locale = 'en'): string {
  const genus = findByLanguage(species?.genera, locale)
  return genus?.genus ?? ''
}

/**
 * Returns the localized native name when available (Japanese by default).
 */
export function extractNativeName(species: PokemonSpeciesData | undefined, locale: Locale = 'en'): string {
  const entry = findByLanguage(species?.names, locale)
  if (entry?.name) return entry.name
  // Some locales (like Japanese) store native scripts under ja-Hrkt only.
  if (locale === 'ja') {
    const japanese = species?.names?.find((item) => item.language?.name === 'ja-Hrkt')
    if (japanese?.name) return japanese.name
  }
  return ''
}

export function extractLocalizedDisplayName(
  data: PokemonData,
  species: PokemonSpeciesData | undefined,
  locale: Locale = 'en'
): string {
  const localized = findByLanguage(species?.names, locale)?.name
  if (localized) return localized
  return formatPokemonName(data.name)
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
