import { ofetch } from 'ofetch'
import { API_BASE_URL, CACHE_MAX_AGE } from './constants'
import type { PokemonData, PokemonSpeciesData } from '@/types/pokemon.types'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const pokemonCache = new Map<string, CacheEntry<PokemonData>>()
const speciesCache = new Map<string, CacheEntry<PokemonSpeciesData>>()

function isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_MAX_AGE
}

export async function fetchPokemon(identifier: string | number): Promise<PokemonData> {
  const key = identifier.toString().toLowerCase()
  const cached = pokemonCache.get(key)
  if (isFresh(cached)) return cached.data

  const data = await ofetch<PokemonData>(`${API_BASE_URL}/pokemon/${key}`)
  pokemonCache.set(key, { data, timestamp: Date.now() })
  return data
}

export async function fetchPokemonSpecies(identifier: string | number): Promise<PokemonSpeciesData> {
  const key = identifier.toString().toLowerCase()
  const cached = speciesCache.get(key)
  if (isFresh(cached)) return cached.data

  const data = await ofetch<PokemonSpeciesData>(`${API_BASE_URL}/pokemon-species/${key}`)
  speciesCache.set(key, { data, timestamp: Date.now() })
  return data
}
