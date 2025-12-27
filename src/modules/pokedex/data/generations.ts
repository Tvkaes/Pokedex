export type GenerationConfig = {
  id: string
  label: string
  range: [number, number]
}

export const POKEMON_GENERATIONS: GenerationConfig[] = [
  { id: 'kanto', label: 'Kanto', range: [1, 151] },
  { id: 'johto', label: 'Johto', range: [152, 251] },
  { id: 'hoenn', label: 'Hoenn', range: [252, 386] },
  { id: 'sinnoh', label: 'Sinnoh', range: [387, 493] },
  { id: 'unova', label: 'Unova', range: [494, 649] },
  { id: 'kalos', label: 'Kalos', range: [650, 721] },
  { id: 'alola', label: 'Alola', range: [722, 809] },
  { id: 'galar', label: 'Galar', range: [810, 905] },
  { id: 'paldea', label: 'Paldea', range: [906, 1010] },
] as const

export const DEFAULT_GENERATION_ID = POKEMON_GENERATIONS[0]?.id ?? 'kanto'
