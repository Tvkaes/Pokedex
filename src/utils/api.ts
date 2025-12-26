import { ofetch } from 'ofetch'
import { API_BASE_URL, CACHE_MAX_AGE } from './constants'
import type { PokemonData, PokemonSpeciesData } from '@/types/pokemon.types'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const pokemonCache = new Map<string, CacheEntry<PokemonData>>()
const speciesCache = new Map<string, CacheEntry<PokemonSpeciesData>>()

/**
 * Determines whether a cached API response is still within the freshness window.
 */
function isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_MAX_AGE
}

/**
 * Fetches the Pokémon core data, leveraging an in-memory cache to avoid redundant requests.
 */
export async function fetchPokemon(identifier: string | number): Promise<PokemonData> {
  const key = identifier.toString().toLowerCase()
  const cached = pokemonCache.get(key)
  if (isFresh(cached)) return cached.data

  const data = await ofetch<PokemonData>(`${API_BASE_URL}/pokemon/${key}`)
  pokemonCache.set(key, { data, timestamp: Date.now() })
  return data
}

/**
 * Fetches extended species information for a Pokémon, also cached in memory.
 */
export async function fetchPokemonSpecies(identifier: string | number): Promise<PokemonSpeciesData> {
  const key = identifier.toString().toLowerCase()
  const cached = speciesCache.get(key)
  if (isFresh(cached)) return cached.data

  const data = await ofetch<PokemonSpeciesData>(`${API_BASE_URL}/pokemon-species/${key}`)
  speciesCache.set(key, { data, timestamp: Date.now() })
  return data
}
