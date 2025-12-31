import { fetchPokemon, fetchPokemonAbility, fetchPokemonItem, fetchPokemonSpecies } from '@/utils/api'
import {
  formatPokemonId,
  formatPokemonName,
  extractDescription,
  extractGenus,
  extractNativeName,
  mapStats,
  selectFeaturedAbility,
} from '@/utils/helpers'
import type { PokemonDetails } from '@/types/pokemon-details.types'
import type {
  PokemonAbilityDetails,
  PokemonAlternateForm,
  PokemonData,
  PokemonDisplayData,
  PokemonFeaturedAbility,
  PokemonGridEntry,
  PokemonSpeciesData,
} from '@/types/pokemon.types'
import { POKEMON_GENERATIONS } from '@pokedex/data/generations'
import { buildItemSpriteUrl, getMegaStoneSlug } from '@pokedex/data/mega-stones'

type PokemonBundle = {
  data: PokemonData
  species: PokemonSpeciesData
  alternateForms: PokemonAlternateForm[]
}

type VariantClassification = {
  kind: NonNullable<PokemonAlternateForm['variantKind']>
  region?: string
}

const REGIONAL_VARIANTS = [
  { keyword: 'alola', region: 'Alola' },
  { keyword: 'galar', region: 'Galar' },
  { keyword: 'hisui', region: 'Hisui' },
  { keyword: 'paldea', region: 'Paldea' },
]

const SPECIAL_VARIANT_KEYWORDS = [
  'attack',
  'defense',
  'speed',
  'school',
  'shield',
  'blade',
  'origin',
  'sky',
  'zen',
  'dawn',
  'dusk',
  'midnight',
  'sunny',
  'rainy',
  'snowy',
  'therian',
  'incarnate',
  'resolute',
  'pirouette',
  'trash',
  'sand',
  'average',
  'sensu',
  'pom-pom',
  'pau',
  'baile',
  'heat',
  'wash',
  'frost',
  'fan',
  'mow',
]

type MegaStoneAsset = { slug: string; sprite?: string | null }
const megaStoneCache = new Map<string, MegaStoneAsset | undefined>()

function classifyVariant(name: string): VariantClassification | null {
  const normalized = name.toLowerCase()

  if (normalized.includes('mega')) {
    return { kind: 'mega' }
  }

  if (normalized.includes('primal')) {
    return { kind: 'primal' }
  }

  const regionalMatch = REGIONAL_VARIANTS.find(({ keyword }) => normalized.includes(keyword))
  if (regionalMatch) {
    return {
      kind: 'regional',
      region: regionalMatch.region,
    }
  }

  if (SPECIAL_VARIANT_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return { kind: 'special' }
  }

  return null
}

async function resolveMegaStoneForForm(formName: string): Promise<MegaStoneAsset | undefined> {
  const slug = getMegaStoneSlug(formName)
  if (!slug) return undefined
  if (megaStoneCache.has(slug)) {
    return megaStoneCache.get(slug)
  }

  try {
    const item = await fetchPokemonItem(slug)
    const asset: MegaStoneAsset = {
      slug,
      sprite: item.sprites?.default ?? buildItemSpriteUrl(slug),
    }
    megaStoneCache.set(slug, asset)
    return asset
  } catch (error) {
    console.warn(`Failed to fetch mega stone item ${slug}`, error)
    const fallback: MegaStoneAsset = {
      slug,
      sprite: buildItemSpriteUrl(slug),
    }
    megaStoneCache.set(slug, fallback)
    return fallback
  }
}

async function extractAlternateForms(speciesData: PokemonSpeciesData): Promise<PokemonAlternateForm[]> {
  const varieties = speciesData?.varieties ?? []
  const classifiedVarieties = varieties
    .filter((variety) => !variety.is_default)
    .map((variety) => {
      const classification = classifyVariant(variety.pokemon.name)
      return classification
        ? {
            variety,
            classification,
          }
        : null
    })
    .filter((entry): entry is { variety: PokemonSpeciesData['varieties'][number]; classification: VariantClassification } =>
      Boolean(entry)
    )

  if (!classifiedVarieties.length) {
    return []
  }

  const forms = await Promise.all(
    classifiedVarieties.map(async ({ variety, classification }) => {
      try {
        const formData = await fetchPokemon(variety.pokemon.name)
        const stoneAsset = await resolveMegaStoneForForm(variety.pokemon.name)
        const stone = stoneAsset
          ? {
              slug: stoneAsset.slug,
              sprite: stoneAsset.sprite ?? null,
            }
          : undefined

        const alternateForm: PokemonAlternateForm = {
          id: formData.id,
          name: formatPokemonName(formData.name),
          formattedId: formatPokemonId(formData.id),
          sprite:
            formData.sprites?.other?.['official-artwork']?.front_default ??
            formData.sprites?.other?.home?.front_default ??
            formData.sprites?.front_default ??
            '',
          primaryType: formData.types?.[0]?.type?.name ?? 'normal',
          cryUrl: formData.cries?.latest ?? formData.cries?.legacy ?? undefined,
          types: formData.types,
          abilities: formData.abilities,
          stats: mapStats(formData),
          height: formData.height / 10,
          weight: formData.weight / 10,
          description: extractDescription(speciesData),
          genus: extractGenus(speciesData),
          variantKind: classification.kind,
          ...(classification.region ? { region: classification.region } : {}),
          ...(stone ? { stone } : {}),
        }

        return alternateForm
      } catch (error) {
        console.error(`Failed to fetch alternate form for ${variety.pokemon.name}`, error)
        return null
      }
    })
  )

  return forms
    .filter((form): form is PokemonAlternateForm => form !== null)
    .filter((form) => form.variantKind !== 'mega' && form.variantKind !== 'primal')
}

async function fetchPokemonBundle(identifier: string | number): Promise<PokemonBundle> {
  const [data, species] = await Promise.all([fetchPokemon(identifier), fetchPokemonSpecies(identifier)])
  const alternateForms = await extractAlternateForms(species)
  return { data, species, alternateForms }
}

function mapDisplayData(
  bundle: PokemonBundle,
  featuredAbilityOverride?: PokemonFeaturedAbility | null
): PokemonDisplayData {
  const { data, species, alternateForms } = bundle
  return {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: formatPokemonName(data.name),
    nativeName: extractNativeName(species),
    description: extractDescription(species),
    genus: extractGenus(species),
    stats: mapStats(data),
    types: data.types,
    abilities: data.abilities,
    featuredAbility: featuredAbilityOverride ?? selectFeaturedAbility(data),
    height: data.height / 10,
    weight: data.weight / 10,
    sprite:
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.other?.home?.front_default ??
      data.sprites?.front_default ??
      '',
    spriteShiny:
      data.sprites?.other?.['official-artwork']?.front_shiny ??
      data.sprites?.other?.home?.front_shiny ??
      data.sprites?.front_shiny ??
      null,
    cryUrl: data.cries?.latest ?? data.cries?.legacy ?? undefined,
    hasMegaEvolution: alternateForms.length > 0,
    alternateForms,
  }
}

function mapGridEntry(bundle: PokemonBundle): PokemonGridEntry {
  const { data, species, alternateForms } = bundle
  return {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: formatPokemonName(data.name),
    nativeName: extractNativeName(species),
    sprite:
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.other?.home?.front_default ??
      data.sprites?.front_default ??
      '',
    primaryType: data.types?.[0]?.type?.name ?? 'normal',
    hasMegaEvolution: alternateForms.length > 0,
    alternateForms: alternateForms.length ? alternateForms : undefined,
    cryUrl: data.cries?.latest ?? data.cries?.legacy ?? undefined,
  }
}

export async function getPokemonGridEntry(identifier: string | number): Promise<PokemonGridEntry> {
  const bundle = await fetchPokemonBundle(identifier)
  return mapGridEntry(bundle)
}

export async function getGenerationGridEntries(generationId: string): Promise<PokemonGridEntry[]> {
  const generation = POKEMON_GENERATIONS.find((gen) => gen.id === generationId)
  if (!generation) {
    return []
  }

  const [rangeStart, rangeEnd] = generation.range
  const start = rangeStart ?? 1
  const end = rangeEnd ?? start
  const ids = Array.from({ length: end - start + 1 }, (_, index) => start + index)

  const results: Array<PokemonGridEntry | undefined> = new Array(ids.length)
  let cursor = 0
  const WORKERS = Math.min(6, ids.length) || 1

  async function worker() {
    while (cursor < ids.length) {
      const index = cursor++
      if (index >= ids.length) break
      const id = ids[index]
      if (typeof id === 'undefined') continue
      const entry = await getPokemonGridEntry(id)
      results[index] = entry
    }
  }

  await Promise.all(Array.from({ length: WORKERS }, worker))
  return results.filter((entry): entry is PokemonGridEntry => Boolean(entry))
}

function extractAbilityDescription(details?: PokemonAbilityDetails | null): string | null {
  if (!details?.effect_entries?.length) return null
  const entry = details.effect_entries.find((item) => item.language?.name === 'en')
  return entry?.short_effect ?? entry?.effect ?? null
}

export async function getPokemonDetails(identifier: string | number): Promise<PokemonDetails> {
  const bundle = await fetchPokemonBundle(identifier)
  const primaryType = bundle.data.types?.[0]?.type?.name ?? 'normal'
  const featuredAbility = selectFeaturedAbility(bundle.data)
  let abilityDescription: string | null = null

  if (featuredAbility?.slug) {
    try {
      const details = await fetchPokemonAbility(featuredAbility.slug)
      abilityDescription = extractAbilityDescription(details)
    } catch (error) {
      console.warn(`Failed to fetch ability details for ${featuredAbility.slug}`, error)
    }
  }

  const display = mapDisplayData(bundle, featuredAbility ? { ...featuredAbility, description: abilityDescription } : featuredAbility)

  return {
    primaryType,
    raw: bundle.data,
    species: bundle.species,
    display,
  }
}
