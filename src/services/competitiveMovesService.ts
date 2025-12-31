import type {
  CompetitiveMoveRecommendation,
  CompetitiveMoveSets,
  PokemonData,
  PokemonMoveData,
  PokemonMoveEntry,
  PokemonStat,
} from '@/types/pokemon.types'
import { fetchPokemon, fetchPokemonMove } from '@/utils/api'
import { getCoverageTargets, getTypeWeaknesses } from '@/data/type-chart'

const MAX_MOVES_TO_ANALYZE = 80
const MOVE_FETCH_BATCH = 10
const STRONG_STAB_THRESHOLD = 70
const BULK_THRESHOLD = 335

const SETUP_BONUS: Record<string, number> = {
  'swords-dance': 60,
  'dragon-dance': 60,
  'nasty-plot': 60,
  'calm-mind': 45,
  'bulk-up': 45,
}

const UTILITY_BONUS: Record<
  string,
  {
    score: number
    roleTag: 'hazard' | 'utility' | 'removal' | 'taunt' | 'status' | 'screen'
  }
> = {
  'stealth-rock': { score: 70, roleTag: 'hazard' },
  spikes: { score: 50, roleTag: 'hazard' },
  'defog': { score: 40, roleTag: 'removal' },
  'rapid-spin': { score: 40, roleTag: 'removal' },
  taunt: { score: 30, roleTag: 'taunt' },
  'will-o-wisp': { score: 30, roleTag: 'status' },
  toxic: { score: 30, roleTag: 'status' },
  'light-screen': { score: 35, roleTag: 'screen' },
  reflect: { score: 35, roleTag: 'screen' },
}

const RELIABLE_RECOVERY_MOVES = new Set([
  'recover',
  'roost',
  'soft-boiled',
  'slack-off',
  'milk-drink',
  'wish',
  'synthesis',
  'moonlight',
  'morning-sun',
  'shore-up',
  'strength-sap',
  'heal-order',
  'oblivion-wing',
  'purify',
  'pollen-puff',
  'rest',
])

type BattleProfile = {
  offensiveBias: 'physical' | 'special' | 'mixed'
  speed: number
  isSweeper: boolean
  isTank: boolean
}

type MoveScore = {
  move: PokemonMoveData
  score: number
  tags: string[]
  isDamaging: boolean
  isStab: boolean
  power: number
  coverageTargets: string[]
  englishEffect: string
}

function getStatValue(stats: PokemonStat[], name: string): number {
  return stats.find((stat) => stat.stat.name === name)?.base_stat ?? 0
}

function determineBattleProfile(stats: PokemonStat[]): BattleProfile {
  const attack = getStatValue(stats, 'attack')
  const specialAttack = getStatValue(stats, 'special-attack')
  const speed = getStatValue(stats, 'speed')
  const bulk = getStatValue(stats, 'hp') + getStatValue(stats, 'defense') + getStatValue(stats, 'special-defense')

  let offensiveBias: BattleProfile['offensiveBias'] = 'mixed'
  if (attack > specialAttack + 15) offensiveBias = 'physical'
  if (specialAttack > attack + 15) offensiveBias = 'special'

  return {
    offensiveBias,
    speed,
    isSweeper: speed >= 100,
    isTank: bulk >= BULK_THRESHOLD,
  }
}

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

function extractEnglishEffect(move: PokemonMoveData): string {
  const effectEntry = move.effect_entries?.find((entry) => entry.language.name === 'en')
  return effectEntry?.short_effect ?? ''
}

function buildReason(moveScore: MoveScore, roleTag: string): string {
  const parts: string[] = []

  if (moveScore.isDamaging) {
    const accuracyLabel = moveScore.move.accuracy ? `${moveScore.move.accuracy}%` : 'variable'
    parts.push(`BP ${moveScore.power} con ${accuracyLabel} de precisión`)
  }

  if (moveScore.tags.includes('setup')) {
    parts.push('Proporciona setup inmediato')
  }

  if (moveScore.tags.includes('priority')) {
    parts.push('Prioridad para rematar')
  }

  if (moveScore.tags.includes('stab')) {
    parts.push('Aprovecha STAB del Pokémon')
  }

  if (moveScore.coverageTargets.length) {
    parts.push(`Cubre amenazas como ${moveScore.coverageTargets.join(', ')}`)
  }

  if (moveScore.tags.includes('recovery')) {
    parts.push('Recuperación fiable')
  } else if (moveScore.tags.includes('drain')) {
    parts.push('Drena vida con cada golpe')
  }

  if (moveScore.tags.includes('hazard')) {
    parts.push('Coloca hazards de entrada')
  }

  if (moveScore.tags.includes('removal')) {
    parts.push('Controla hazards enemigos')
  }

  if (moveScore.tags.includes('taunt')) {
    parts.push('Bloquea setups rivales')
  }

  if (moveScore.tags.includes('status')) {
    parts.push('Aplica estados persistentes')
  }

  if (!parts.length && moveScore.englishEffect) {
    parts.push(moveScore.englishEffect)
  }

  parts.push(`Rol: ${roleTag}`)
  return parts.join('. ')
}

function scoreMove(
  move: PokemonMoveData,
  pokemon: PokemonData,
  profile: BattleProfile,
  weaknessCoverage: string[]
): MoveScore | null {
  const typeName = move.type?.name ?? 'normal'
  const pokemonTypes = pokemon.types.map((entry) => entry.type.name)
  const isStab = pokemonTypes.includes(typeName)
  const isDamaging = move.damage_class?.name !== 'status' && (move.power ?? 0) > 0
  const power = move.power ?? 0
  let totalScore = 0
  const tags: string[] = []

  if (isDamaging) {
    const accuracyFactor = move.accuracy ? move.accuracy / 100 : 0.85
    totalScore += power * accuracyFactor

    if (isStab) {
      totalScore += 25
      tags.push('stab')
    }

    if (
      (profile.offensiveBias === 'physical' && move.damage_class?.name === 'physical') ||
      (profile.offensiveBias === 'special' && move.damage_class?.name === 'special')
    ) {
      totalScore += 10
    }

    if (move.priority > 0) {
      totalScore += 25
      tags.push('priority')
    }

    if (move.meta?.drain && move.meta.drain < 0) {
      totalScore -= 10
    } else if (move.meta?.drain && move.meta.drain > 0) {
      totalScore += 15
      tags.push('drain')
    }
  }

  const setupBonus = SETUP_BONUS[move.name]
  if (setupBonus) {
    totalScore += setupBonus
    tags.push('setup')
  }

  const utilityBonus = UTILITY_BONUS[move.name]
  if (utilityBonus) {
    totalScore += utilityBonus.score
    tags.push(utilityBonus.roleTag, 'utility')
  }

  if (RELIABLE_RECOVERY_MOVES.has(move.name) || move.meta?.healing) {
    totalScore += 50
    tags.push('recovery')
  }

  if (move.name === 'leech-seed') {
    totalScore += 35
    tags.push('recovery', 'status')
  }

  const coverageTargets = getCoverageTargets(typeName).filter((target) => weaknessCoverage.includes(target))
  if (coverageTargets.length) {
    totalScore += 15
    tags.push('coverage')
  }

  if (!totalScore) {
    return null
  }

  return {
    move,
    score: totalScore,
    tags,
    isDamaging,
    isStab,
    power,
    coverageTargets,
    englishEffect: extractEnglishEffect(move),
  }
}

function recommendationFromScore(moveScore: MoveScore, roleTag: string): CompetitiveMoveRecommendation {
  return {
    name: moveScore.move.name,
    type: moveScore.move.type?.name ?? 'normal',
    roleTag,
    reason: buildReason(moveScore, roleTag),
  }
}

function pickStrongStab(
  moves: MoveScore[],
  profile: BattleProfile,
  excluded: Set<string>,
  count: number
): MoveScore[] {
  const preferredClass =
    profile.offensiveBias === 'mixed' ? null : profile.offensiveBias === 'physical' ? 'physical' : 'special'

  const stabPool = moves
    .filter(
      (move) =>
        move.isDamaging &&
        move.isStab &&
        move.power >= STRONG_STAB_THRESHOLD &&
        !excluded.has(move.move.name) &&
        (!preferredClass || move.move.damage_class?.name === preferredClass)
    )
    .sort((a, b) => b.score - a.score)

  const picked: MoveScore[] = []
  for (const move of stabPool) {
    if (picked.length >= count) break
    picked.push(move)
    excluded.add(move.move.name)
  }
  return picked
}

function pickCoverageMoves(moves: MoveScore[], excluded: Set<string>, count: number): MoveScore[] {
  const coveragePool = moves
    .filter(
      (move) =>
        move.isDamaging && !move.isStab && !excluded.has(move.move.name) && (move.tags.includes('coverage') || move.power >= 70)
    )
    .sort((a, b) => b.score - a.score)

  const picked: MoveScore[] = []
  for (const move of coveragePool) {
    if (picked.length >= count) break
    picked.push(move)
    excluded.add(move.move.name)
  }
  return picked
}

function buildSweeperSet(moves: MoveScore[], profile: BattleProfile): CompetitiveMoveRecommendation[] {
  const selection: CompetitiveMoveRecommendation[] = []
  const excluded = new Set<string>()

  const setupMove = moves
    .filter((move) => move.tags.includes('setup'))
    .sort((a, b) => b.score - a.score)
    .find((move) => !excluded.has(move.move.name))
  if (setupMove) {
    excluded.add(setupMove.move.name)
    selection.push(recommendationFromScore(setupMove, 'setup'))
  }

  const stabMoves = pickStrongStab(moves, profile, excluded, 2)
  if (stabMoves.length < 2) return []
  stabMoves.forEach((move) => selection.push(recommendationFromScore(move, 'stab')))

  const finishingPool = moves
    .filter(
      (move) =>
        !excluded.has(move.move.name) &&
        (move.tags.includes('coverage') || move.tags.includes('priority') || (!move.isStab && move.power >= 70))
    )
    .sort((a, b) => b.score - a.score)

  const closer = finishingPool[0]
  if (!closer) return []
  excluded.add(closer.move.name)
  const roleTag = moveRoleTag(closer)
  selection.push(recommendationFromScore(closer, roleTag))

  if (selection.length !== 4) return []
  return selection
}

function moveRoleTag(move: MoveScore): string {
  if (move.tags.includes('setup')) return 'setup'
  if (move.tags.includes('recovery')) return 'recovery'
  if (move.tags.includes('hazard')) return 'hazard'
  if (move.tags.includes('removal')) return 'removal'
  if (move.tags.includes('taunt')) return 'taunt'
  if (move.tags.includes('status')) return 'status'
  if (move.tags.includes('coverage')) return 'coverage'
  if (move.tags.includes('priority')) return 'priority'
  if (move.tags.includes('stab')) return 'stab'
  return 'utility'
}

function buildWallbreakerSet(moves: MoveScore[], profile: BattleProfile): CompetitiveMoveRecommendation[] {
  const selection: CompetitiveMoveRecommendation[] = []
  const excluded = new Set<string>()
  const stabMoves = pickStrongStab(moves, profile, excluded, 2)
  if (stabMoves.length < 2) return []
  stabMoves.forEach((move) => selection.push(recommendationFromScore(move, 'stab')))

  const coverage = pickCoverageMoves(moves, excluded, 2)
  if (coverage.length < 2) return []
  coverage.forEach((move) => selection.push(recommendationFromScore(move, 'coverage')))

  return selection
}

function buildTankSet(moves: MoveScore[]): CompetitiveMoveRecommendation[] {
  const selection: CompetitiveMoveRecommendation[] = []
  const excluded = new Set<string>()

  const stab = moves
    .filter((move) => move.isDamaging && move.isStab && !excluded.has(move.move.name))
    .sort((a, b) => b.score - a.score)[0]
  if (!stab) return []
  excluded.add(stab.move.name)
  selection.push(recommendationFromScore(stab, 'stab'))

  const recovery = moves
    .filter((move) => move.tags.includes('recovery') && !excluded.has(move.move.name))
    .sort((a, b) => b.score - a.score)[0]
  if (!recovery) return []
  excluded.add(recovery.move.name)
  selection.push(recommendationFromScore(recovery, 'recovery'))

  const status = moves
    .filter((move) => move.tags.includes('status') && !excluded.has(move.move.name))
    .sort((a, b) => b.score - a.score)[0]
  if (!status) return []
  excluded.add(status.move.name)
  selection.push(recommendationFromScore(status, 'status'))

  const utility = moves
    .filter((move) => move.tags.includes('utility') && !excluded.has(move.move.name))
    .sort((a, b) => b.score - a.score)[0]
  if (!utility) return []
  excluded.add(utility.move.name)
  selection.push(recommendationFromScore(utility, moveRoleTag(utility)))

  return selection
}

function buildSupportSet(moves: MoveScore[]): CompetitiveMoveRecommendation[] {
  const selection: CompetitiveMoveRecommendation[] = []
  const excluded = new Set<string>()

  const prioritizedTags: Array<{ tag: string; count: number }> = [
    { tag: 'hazard', count: 1 },
    { tag: 'removal', count: 1 },
    { tag: 'taunt', count: 1 },
    { tag: 'screen', count: 1 },
  ]

  for (const { tag, count } of prioritizedTags) {
    const candidates = moves
      .filter((move) => move.tags.includes(tag) && !excluded.has(move.move.name))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
    candidates.forEach((move) => {
      excluded.add(move.move.name)
      selection.push(recommendationFromScore(move, moveRoleTag(move)))
    })
  }

  if (selection.length < 4) {
    const filler = moves
      .filter((move) => !excluded.has(move.move.name) && (move.tags.includes('utility') || move.tags.includes('status')))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4 - selection.length)
    filler.forEach((move) => {
      excluded.add(move.move.name)
      selection.push(recommendationFromScore(move, moveRoleTag(move)))
    })
  }

  if (selection.length < 4) {
    const stabSupport = moves
      .filter((move) => move.isStab && !excluded.has(move.move.name))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4 - selection.length)
    stabSupport.forEach((move) => {
      excluded.add(move.move.name)
      selection.push(recommendationFromScore(move, 'stab'))
    })
  }

  return selection.length === 4 ? selection : []
}

function filterViableMoves(scored: Array<MoveScore | null>): MoveScore[] {
  return scored
    .filter((entry): entry is MoveScore => Boolean(entry && entry.score >= 30))
    .sort((a, b) => b.score - a.score)
}

export async function generateCompetitiveMoveSets(identifier: string | number): Promise<CompetitiveMoveSets> {
  const pokemon = await fetchPokemon(identifier)
  const profile = determineBattleProfile(pokemon.stats)
  const pokemonTypes = pokemon.types.map((type) => type.type.name)
  const weaknesses = getTypeWeaknesses(pokemonTypes)
  const candidateEntries = selectCandidateMoves(pokemon.moves)
  const moveDetails = await fetchMoveDetails(candidateEntries)
  const scoredMoves = filterViableMoves(
    moveDetails.map((move) => scoreMove(move, pokemon, profile, weaknesses))
  )

  if (!scoredMoves.length) {
    return { sweeper: [], wallbreaker: [], tank: [], support: [] }
  }

  const sweeper = buildSweeperSet(scoredMoves, profile)
  const wallbreaker = buildWallbreakerSet(scoredMoves, profile)
  const tank = profile.isTank ? buildTankSet(scoredMoves) : []
  const support = buildSupportSet(scoredMoves)

  return {
    sweeper,
    wallbreaker,
    tank,
    support,
  }
}
