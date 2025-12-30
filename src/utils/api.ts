import { ofetch } from 'ofetch'
import { API_BASE_URL, CACHE_MAX_AGE } from './constants'
import type { PokemonData, PokemonItemData, PokemonSpeciesData } from '@/types/pokemon.types'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const pokemonCache = new Map<string, CacheEntry<PokemonData>>()
const speciesCache = new Map<string, CacheEntry<PokemonSpeciesData>>()
const itemCache = new Map<string, CacheEntry<PokemonItemData>>()

/**
 * Determines whether a cached API response is still within the freshness window.
 */
function isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_MAX_AGE
}

interface FetchOptions {
  retries?: number
  retryDelay?: number
}

async function fetchWithRetry<T>(url: string, { retries = 2, retryDelay = 300 }: FetchOptions = {}): Promise<T> {
  let attempt = 0
  let lastError: unknown = null

  while (attempt <= retries) {
    try {
      return await ofetch<T>(url)
    } catch (error) {
      lastError = error
      attempt += 1
      if (attempt > retries) break
      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt))
    }
  }

  console.error(`Failed to fetch ${url} after ${retries + 1} attempts`, lastError)
  throw lastError
}

/**
 * Fetches the Pokémon core data, leveraging an in-memory cache to avoid redundant requests.
 */
export async function fetchPokemon(identifier: string | number): Promise<PokemonData> {
  const key = identifier.toString().toLowerCase()
  const cached = pokemonCache.get(key)
  if (isFresh(cached)) return cached.data

  const data = await fetchWithRetry<PokemonData>(`${API_BASE_URL}/pokemon/${key}`)
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

  const data = await fetchWithRetry<PokemonSpeciesData>(`${API_BASE_URL}/pokemon-species/${key}`)
  speciesCache.set(key, { data, timestamp: Date.now() })
  return data
}

/**
 * Retrieves item metadata (used for Mega Stones) with caching.
 */
export async function fetchPokemonItem(identifier: string): Promise<PokemonItemData> {
  const key = identifier.toLowerCase()
  const cached = itemCache.get(key)
  if (isFresh(cached)) return cached.data

  const data = await fetchWithRetry<PokemonItemData>(`${API_BASE_URL}/item/${key}`)
  itemCache.set(key, { data, timestamp: Date.now() })
  return data
}
