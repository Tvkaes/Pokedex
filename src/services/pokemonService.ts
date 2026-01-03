import { fetchPokemon, fetchPokemonAbility, fetchPokemonItem, fetchPokemonSpecies } from '@/utils/api'
import {
  formatPokemonId,
  formatPokemonName,
  extractDescription,
  extractGenus,
  extractNativeName,
  extractLocalizedDisplayName,
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
  PokemonSignatureMove,
  PokemonSpeciesData,
} from '@/types/pokemon.types'
import { generateCompetitiveMoveSets } from '@/services/competitiveMovesService'
import { POKEMON_GENERATIONS } from '@pokedex/data/generations'
import { buildItemSpriteUrl, getMegaStoneSlug } from '@pokedex/data/mega-stones'
import type { Locale } from '@/locales/translations'

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
const pokemonDetailsCache = new Map<string, PokemonDetails>()
const competitiveSetsCache = new Map<string, PokemonDisplayData['competitiveSets']>()

function normalizeIdentifier(identifier: string | number): string {
  return String(identifier).toLowerCase()
}

function classifyVariant(name: string): VariantClassification | null {
  const normalized = name.toLowerCase()

  if (normalized.includes('mega')) {
    return { kind: 'mega' }
  }

  if (normalized.includes('primal')) {
    return { kind: 'primal' }
  }

  if (normalized.includes('gigantamax') || normalized.includes('gmax') || normalized.includes('dynamax') || normalized.includes('dmax')) {
    return { kind: 'dynamax' }
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

async function extractAlternateForms(speciesData: PokemonSpeciesData, locale: Locale): Promise<PokemonAlternateForm[]> {
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
          spriteShiny:
            formData.sprites?.other?.['official-artwork']?.front_shiny ??
            formData.sprites?.other?.home?.front_shiny ??
            formData.sprites?.front_shiny ??
            null,
          primaryType: formData.types?.[0]?.type?.name ?? 'normal',
          cryUrl: formData.cries?.latest ?? formData.cries?.legacy ?? undefined,
          types: formData.types,
          abilities: formData.abilities,
          stats: mapStats(formData),
          height: formData.height / 10,
          weight: formData.weight / 10,
          description: extractDescription(speciesData, locale),
          genus: extractGenus(speciesData, locale),
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

  return forms.filter((form): form is PokemonAlternateForm => form !== null)
}

async function fetchPokemonBundle(identifier: string | number, locale: Locale): Promise<PokemonBundle> {
  const [data, species] = await Promise.all([fetchPokemon(identifier), fetchPokemonSpecies(identifier)])
  const alternateForms = await extractAlternateForms(species, locale)
  return { data, species, alternateForms }
}

function formatMoveLabel(name: string): string {
  return name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function selectSignatureMoves(data: PokemonData): PokemonSignatureMove[] {
  if (!data.moves?.length) return []

  const normalized = data.moves
    .map((entry): PokemonSignatureMove => {
      const primaryDetail =
        entry.version_group_details?.find((detail) => detail.move_learn_method?.name === 'level-up') ??
        entry.version_group_details?.[0]

      if (!primaryDetail) {
        return {
          name: formatMoveLabel(entry.move.name),
        }
      }

      return {
        name: formatMoveLabel(entry.move.name),
        level: primaryDetail.level_learned_at || undefined,
        method: primaryDetail.move_learn_method?.name ?? undefined,
        versionGroup: primaryDetail.version_group?.name ?? undefined,
      }
    })

  return normalized
    .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
    .slice(0, 4)
}

function mapDisplayData(
  bundle: PokemonBundle,
  locale: Locale,
  featuredAbilityOverride?: PokemonFeaturedAbility | null
): PokemonDisplayData {
  const { data, species, alternateForms } = bundle
  return {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: extractLocalizedDisplayName(data, species, locale),
    nativeName: extractNativeName(species, 'ja'),
    description: extractDescription(species, locale),
    genus: extractGenus(species, locale),
    stats: mapStats(data),
    types: data.types,
    abilities: data.abilities,
    featuredAbility: featuredAbilityOverride ?? selectFeaturedAbility(data),
    signatureMoves: selectSignatureMoves(data),
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

function mapGridEntry(bundle: PokemonBundle, locale: Locale): PokemonGridEntry {
  const { data, species, alternateForms } = bundle
  return {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: extractLocalizedDisplayName(data, species, locale),
    nativeName: extractNativeName(species, 'ja'),
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

export async function getPokemonGridEntry(identifier: string | number, locale: Locale = 'en'): Promise<PokemonGridEntry> {
  const bundle = await fetchPokemonBundle(identifier, locale)
  return mapGridEntry(bundle, locale)
}

export async function getGenerationGridEntries(generationId: string, locale: Locale = 'en'): Promise<PokemonGridEntry[]> {
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
      const entry = await getPokemonGridEntry(id, locale)
      results[index] = entry
    }
  }

  await Promise.all(Array.from({ length: WORKERS }, worker))
  return results.filter((entry): entry is PokemonGridEntry => Boolean(entry))
}

const ABILITY_LANGUAGE_PREFERENCE: Record<Locale, string[]> = {
  en: ['en'],
  es: ['es'],
  ja: ['ja'],
}

function extractAbilityDescription(details: PokemonAbilityDetails | undefined | null, locale: Locale): string | null {
  if (!details?.effect_entries?.length) return null
  const preference = [...(ABILITY_LANGUAGE_PREFERENCE[locale] ?? ABILITY_LANGUAGE_PREFERENCE.en), 'en']
  for (const code of preference) {
    const entry = details.effect_entries.find((item) => item.language?.name === code)
    if (entry) {
      return entry.short_effect ?? entry.effect ?? null
    }
  }
  return null
}

function buildDetailsCacheKey(identifier: string | number, locale: Locale): string {
  return `${normalizeIdentifier(identifier)}::${locale}`
}

export async function getPokemonDetails(identifier: string | number, locale: Locale = 'en'): Promise<PokemonDetails> {
  const cacheKey = buildDetailsCacheKey(identifier, locale)
  const cached = pokemonDetailsCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const bundle = await fetchPokemonBundle(identifier, locale)
  const primaryType = bundle.data.types?.[0]?.type?.name ?? 'normal'
  const featuredAbility = selectFeaturedAbility(bundle.data)
  let abilityDescription: string | null = null

  if (featuredAbility?.slug) {
    try {
      const details = await fetchPokemonAbility(featuredAbility.slug)
      abilityDescription = extractAbilityDescription(details, locale)
    } catch (error) {
      console.warn(`Failed to fetch ability details for ${featuredAbility.slug}`, error)
    }
  }

  const display = mapDisplayData(
    bundle,
    locale,
    featuredAbility ? { ...featuredAbility, description: abilityDescription } : featuredAbility
  )

  const details: PokemonDetails = {
    primaryType,
    raw: bundle.data,
    species: bundle.species,
    display,
  }

  pokemonDetailsCache.set(cacheKey, details)
  return details
}

export async function prefetchPokemonDetails(identifier: string | number, locale: Locale = 'en'): Promise<void> {
  try {
    await getPokemonDetails(identifier, locale)
  } catch (error) {
    console.warn(`Prefetch failed for Pokémon ${identifier}`, error)
  }
}

export async function getPokemonCompetitiveMoveSets(identifier: string | number): Promise<PokemonDisplayData['competitiveSets']> {
  const cacheKey = normalizeIdentifier(identifier)
  if (competitiveSetsCache.has(cacheKey)) {
    return competitiveSetsCache.get(cacheKey) ?? null
  }

  try {
    const sets = await generateCompetitiveMoveSets(identifier)
    competitiveSetsCache.set(cacheKey, sets)
    return sets
  } catch (error) {
    console.warn(`Failed to build competitive move sets for ${identifier}`, error)
    competitiveSetsCache.set(cacheKey, null)
    return null
  }
}
