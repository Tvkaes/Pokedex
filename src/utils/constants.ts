export const API_BASE_URL = 'https://pokeapi.co/api/v2'
export const CACHE_MAX_AGE = 1000 * 60 * 60 // 1 hour
export const DEFAULT_POKEMON = 'pikachu'

export const POPULAR_POKEMON = [
  'pikachu',
  'charizard',
  'mewtwo',
  'lucario',
  'greninja',
  'gengar'
]

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP. ATK',
  'special-defense': 'SP. DEF',
  speed: 'SPD'
}
