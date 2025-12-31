export type TypeChartEntry = {
  strongAgainst: string[]
  weakAgainst: string[]
  immuneTo: string[]
}

export const TYPE_CHART: Record<string, TypeChartEntry> = {
  normal: { strongAgainst: [], weakAgainst: ['rock', 'steel'], immuneTo: ['ghost'] },
  fire: { strongAgainst: ['grass', 'ice', 'bug', 'steel'], weakAgainst: ['fire', 'water', 'rock', 'dragon'], immuneTo: [] },
  water: { strongAgainst: ['fire', 'ground', 'rock'], weakAgainst: ['water', 'grass', 'dragon'], immuneTo: [] },
  electric: { strongAgainst: ['water', 'flying'], weakAgainst: ['electric', 'grass', 'dragon'], immuneTo: ['ground'] },
  grass: {
    strongAgainst: ['water', 'ground', 'rock'],
    weakAgainst: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
    immuneTo: [],
  },
  ice: { strongAgainst: ['grass', 'ground', 'flying', 'dragon'], weakAgainst: ['fire', 'water', 'ice', 'steel'], immuneTo: [] },
  fighting: {
    strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
    weakAgainst: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    immuneTo: ['ghost'],
  },
  poison: { strongAgainst: ['grass', 'fairy'], weakAgainst: ['poison', 'ground', 'rock', 'ghost'], immuneTo: ['steel'] },
  ground: { strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'], weakAgainst: ['grass', 'bug'], immuneTo: ['flying'] },
  flying: { strongAgainst: ['grass', 'fighting', 'bug'], weakAgainst: ['electric', 'rock', 'steel'], immuneTo: [] },
  psychic: { strongAgainst: ['fighting', 'poison'], weakAgainst: ['psychic', 'steel'], immuneTo: ['dark'] },
  bug: {
    strongAgainst: ['grass', 'psychic', 'dark'],
    weakAgainst: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
    immuneTo: [],
  },
  rock: { strongAgainst: ['fire', 'ice', 'flying', 'bug'], weakAgainst: ['fighting', 'ground', 'steel'], immuneTo: [] },
  ghost: { strongAgainst: ['psychic', 'ghost'], weakAgainst: ['dark'], immuneTo: ['normal'] },
  dragon: { strongAgainst: ['dragon'], weakAgainst: ['steel'], immuneTo: ['fairy'] },
  dark: { strongAgainst: ['psychic', 'ghost'], weakAgainst: ['fighting', 'dark', 'fairy'], immuneTo: [] },
  steel: { strongAgainst: ['ice', 'rock', 'fairy'], weakAgainst: ['fire', 'water', 'electric', 'steel'], immuneTo: [] },
  fairy: { strongAgainst: ['fighting', 'dragon', 'dark'], weakAgainst: ['fire', 'poison', 'steel'], immuneTo: [] },
}

export function getTypeWeaknesses(pokemonTypes: string[]): string[] {
  const multipliers: Record<string, number> = {}

  for (const attackingType of Object.keys(TYPE_CHART)) {
    let modifier = 1
    for (const rawDefType of pokemonTypes) {
      const defType = rawDefType.toLowerCase()
      const chart = TYPE_CHART[attackingType]
      if (!chart) continue

      if (chart.strongAgainst.includes(defType)) {
        modifier *= 2
      } else if (chart.weakAgainst.includes(defType)) {
        modifier *= 0.5
      } else if (chart.immuneTo.includes(defType)) {
        modifier = 0
        break
      }
    }
    multipliers[attackingType] = modifier
  }

  return Object.entries(multipliers)
    .filter(([, value]) => value > 1)
    .map(([type]) => type)
}

export function getCoverageTargets(attackType: string): string[] {
  const entry = TYPE_CHART[attackType.toLowerCase()]
  if (!entry) return []
  return entry.strongAgainst
}
