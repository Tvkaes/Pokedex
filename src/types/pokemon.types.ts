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

export interface PokemonAbilityDetails {
  id: number
  name: string
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: { name: string }
  }>
}

export interface PokemonFeaturedAbility {
  name: string
  slug: string
  isHidden: boolean
  description?: string | null
}

export interface PokemonSprites {
  other?: {
    ['official-artwork']?: {
      front_default?: string | null
      front_shiny?: string | null
    }
    home?: {
      front_default?: string | null
      front_shiny?: string | null
    }
  }
  front_default?: string | null
  front_shiny?: string | null
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
  name?: string
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
  varieties: Array<{
    is_default: boolean
    pokemon: {
      name: string
      url: string
    }
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
  featuredAbility?: PokemonFeaturedAbility | null
  height: number
  weight: number
  sprite: string
  spriteShiny?: string | null
  cryUrl?: string
  hasMegaEvolution?: boolean
  alternateForms?: PokemonAlternateForm[]
}

export interface PokemonAlternateForm {
  id: number
  name: string
  formattedId: string
  sprite: string
  primaryType: string
  variantKind?: 'regional' | 'special' | 'mega' | 'primal'
  region?: string
  types?: PokemonType[]
  abilities?: PokemonAbility[]
  stats?: PokemonDisplayData['stats']
  height?: number
  weight?: number
  description?: string
  genus?: string
  stone?: {
    slug: string
    sprite?: string | null
  }
  cryUrl?: string
}

export interface PokemonGridEntry {
  id: number
  formattedId: string
  name: string
  nativeName?: string
  sprite: string
  primaryType: string
  hasMegaEvolution: boolean
  alternateForms?: PokemonAlternateForm[]
  cryUrl?: string
}

export interface PokemonItemData {
  id: number
  name: string
  sprites: {
    default?: string | null
  }
}
