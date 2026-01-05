import {
  determineBattleProfile,
  getTypeWeaknesses,
  scoreMove,
  filterViableMoves,
  buildAllSets,
  type PokemonMoveData,
  type PokemonMoveEntry,
  type CompetitiveSets,
} from '@tvkaes/pkmn-core'
import { fetchPokemon, fetchPokemonMove } from '@/utils/api'

const MAX_MOVES_TO_ANALYZE = 80
const MOVE_FETCH_BATCH = 10

function selectCandidateMoves(moves: PokemonMoveEntry[]): PokemonMoveEntry[] {
  const uniqueMoves = new Map<string, PokemonMoveEntry>()
  for (const entry of moves) {
    const name = entry.move.name
    if (!uniqueMoves.has(name)) {
      uniqueMoves.set(name, entry)
    }
  }
  return Array.from(uniqueMoves.values()).slice(0, MAX_MOVES_TO_ANALYZE)
}

async function fetchMoveDetails(entries: PokemonMoveEntry[]): Promise<PokemonMoveData[]> {
  const details: PokemonMoveData[] = []
  for (let i = 0; i < entries.length; i += MOVE_FETCH_BATCH) {
    const slice = entries.slice(i, i + MOVE_FETCH_BATCH)
    const chunk = await Promise.all(slice.map((entry) => fetchPokemonMove(entry.move.url)))
    details.push(...chunk)
  }
  return details
}

export async function generateCompetitiveMoveSets(identifier: string | number): Promise<CompetitiveSets> {
  const pokemon = await fetchPokemon(identifier)
  const profile = determineBattleProfile(pokemon.stats)
  const pokemonTypes = pokemon.types.map((type) => type.type.name)
  const weaknesses = getTypeWeaknesses(pokemonTypes)
  const candidateEntries = selectCandidateMoves(pokemon.moves)
  const moveDetails = await fetchMoveDetails(candidateEntries)

  const scoringContext = {
    pokemonTypes,
    offensiveBias: profile.offensiveBias,
    weaknessCoverage: weaknesses,
  }

  const scoredMoves = filterViableMoves(
    moveDetails.map((move) => scoreMove(move, scoringContext))
  )

  if (!scoredMoves.length) {
    return { sweeper: [], wallbreaker: [], tank: [], support: [] }
  }

  return buildAllSets(scoredMoves, profile)
}
