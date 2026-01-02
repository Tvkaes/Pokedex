<script setup lang="ts">
import { computed } from 'vue'
import { getOffensiveCoverage, getTypeMatchups } from '@/data/type-chart'
import type { PokemonType } from '@/types/pokemon.types'
import PokemonMatchupCard from './PokemonMatchupCard.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const props = defineProps<{
  types: PokemonType[]
}>()

const normalizedTypes = computed(() => props.types.map((entry) => entry.type.name))
const matchupData = computed(() => getTypeMatchups(normalizedTypes.value))
const offensiveCoverage = computed(() => getOffensiveCoverage(normalizedTypes.value))

const topWeaknesses = computed(() => matchupData.value.weaknesses.slice(0, 5))
const topStrengths = computed(() => offensiveCoverage.value.slice(0, 5))

function formatMultiplier(multiplier: number) {
  if (multiplier === 0) return 'Immune'
  const rounded = Number.isInteger(multiplier) ? multiplier : parseFloat(multiplier.toFixed(2))
  return `${rounded}x`
}

const weaknessEntries = computed(() =>
  topWeaknesses.value.map((entry) => ({
    type: entry.type,
    value: formatMultiplier(entry.multiplier),
    tone: 'danger' as const,
  }))
)

const strengthEntries = computed(() =>
  topStrengths.value.map((entry) => ({
    type: entry.type,
    value: formatMultiplier(entry.multiplier),
    meta: entry.sources.join(' · ').toUpperCase(),
    tone: 'success' as const,
  }))
)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <PokemonMatchupCard
      :kicker="t('matchups.damageTaken')"
      :title="t('matchups.weakTo')"
      :entries="weaknessEntries"
      :empty-message="t('matchups.noWeaknesses')"
    />
    <PokemonMatchupCard
      :kicker="t('matchups.damageDealt')"
      :title="t('matchups.strongAgainst')"
      :entries="strengthEntries"
      :empty-message="t('matchups.noStrengths')"
    />
  </div>
</template>
