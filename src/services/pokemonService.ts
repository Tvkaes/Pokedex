import { fetchPokemon, fetchPokemonItem, fetchPokemonSpecies } from '@/utils/api'
import { formatPokemonId, formatPokemonName, extractDescription, extractGenus, extractNativeName, mapStats } from '@/utils/helpers'
import type { PokemonDetails } from '@/types/pokemon-details.types'
import type { PokemonAlternateForm, PokemonData, PokemonDisplayData, PokemonGridEntry } from '@/types/pokemon.types'
import { POKEMON_GENERATIONS } from '@pokedex/data/generations'
import { buildItemSpriteUrl, getMegaStoneSlug } from '@pokedex/data/mega-stones'

function mapDisplayData(
  data: PokemonData,
  speciesData: Awaited<ReturnType<typeof fetchPokemonSpecies>>,
  alternateForms: PokemonAlternateForm[] = []
): PokemonDetails['display'] {
  const display: PokemonDisplayData = {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: formatPokemonName(data.name),
    nativeName: extractNativeName(speciesData),
    description: extractDescription(speciesData),
    genus: extractGenus(speciesData),
    stats: mapStats(data),
    types: data.types,
    abilities: data.abilities,
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

  return display
}

const SPECIAL_FORM_KEYWORDS = ['mega', 'primal']
type MegaStoneAsset = { slug: string; sprite?: string | null }
const megaStoneCache = new Map<string, MegaStoneAsset | undefined>()

function isSpecialForm(name: string): boolean {
  const normalized = name.toLowerCase()
  return SPECIAL_FORM_KEYWORDS.some((keyword) => normalized.includes(keyword))
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

async function extractAlternateForms(
  speciesData: Awaited<ReturnType<typeof fetchPokemonSpecies>>
): Promise<PokemonAlternateForm[]> {
  const varieties = speciesData?.varieties ?? []
  const specialVarieties = varieties.filter((variety) => !variety.is_default && isSpecialForm(variety.pokemon.name))
  if (!specialVarieties.length) {
    return []
  }

  const forms = await Promise.all(
    specialVarieties.map(async (variety) => {
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

/**
 * Returns the lightweight data required for the grid cards.
 */
export async function getPokemonGridEntry(identifier: string | number): Promise<PokemonGridEntry> {
  const [data, species] = await Promise.all([fetchPokemon(identifier), fetchPokemonSpecies(identifier)])
  const alternateForms = await extractAlternateForms(species)
  return mapGridEntry(data, species, alternateForms)
}

/**
 * Retrieves every Pokémon belonging to a generation range for grid rendering.
 */
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

function mapGridEntry(
  data: PokemonData,
  speciesData: Awaited<ReturnType<typeof fetchPokemonSpecies>>,
  alternateForms: PokemonAlternateForm[]
): PokemonGridEntry {
  return {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: formatPokemonName(data.name),
    nativeName: extractNativeName(speciesData),
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

/**
 * Fetches every data source needed to display a Pokémon and returns raw+formatted information.
 */
export async function getPokemonDetails(identifier: string | number): Promise<PokemonDetails> {
  const [data, species] = await Promise.all([fetchPokemon(identifier), fetchPokemonSpecies(identifier)])
  const primaryType = data.types?.[0]?.type?.name ?? 'normal'
  const alternateForms = await extractAlternateForms(species)

  return {
    primaryType,
    raw: data,
    species,
    display: mapDisplayData(data, species, alternateForms),
  }
}
