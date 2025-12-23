export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonAbility {
  is_hidden: boolean
  slot: number
  ability: {
    name: string
    url: string
  }
}

export interface PokemonSprites {
  other?: {
    ['official-artwork']?: {
      front_default?: string | null
    }
    home?: {
      front_default?: string | null
    }
  }
  front_default?: string | null
}

export interface PokemonCries {
  latest?: string | null
  legacy?: string | null
}

export interface PokemonData {
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonSprites
  cries?: PokemonCries
  abilities: PokemonAbility[]
  types: PokemonType[]
  stats: PokemonStat[]
}

export interface PokemonSpeciesData {
  id: number
  color: {
    name: string
  }
  flavor_text_entries: Array<{
    flavor_text: string
    language: { name: string }
    version: { name: string }
  }>
  genera: Array<{
    genus: string
    language: { name: string }
  }>
  names: Array<{
    name: string
    language: { name: string }
  }>
}

export interface PokemonDisplayData {
  id: number
  formattedId: string
  name: string
  nativeName?: string
  description: string
  genus: string
  stats: Array<{
    label: string
    value: number
    percentage: number
  }>
  types: PokemonType[]
  abilities: PokemonAbility[]
  height: number
  weight: number
  sprite: string
  cryUrl?: string
}
