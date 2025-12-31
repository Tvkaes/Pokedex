<script setup lang="ts">
import type { CompetitiveMoveRecommendation } from '@/types/pokemon.types'
import PokemonCompetitiveMoveCard from './PokemonCompetitiveMoveCard.vue'

export interface CompetitiveCategorySummary {
  key: string
  label: string
  accent: string
  moves: CompetitiveMoveRecommendation[]
}

const props = defineProps<{
  category: CompetitiveCategorySummary
}>()

const emit = defineEmits<{
  back: []
}>()

function handleBack() {
  emit('back')
}
</script>

<template>
  <div class="space-y-2.5 sm:space-y-3.5">
    <div class="flex items-center justify-between gap-2 sm:gap-3">
      <div>
        <p class="text-xs sm:text-sm font-semibold tracking-[0.3em]" :class="props.category.accent">
          {{ props.category.label.toUpperCase() }}
        </p>
      </div>
      <button
        type="button"
        class="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/70 hover:text-white border border-white/20 hover:border-white/50 rounded-full px-3 sm:px-4 py-1.5 transition-colors"
        @click="handleBack"
      >
        ← Back
      </button>
    </div>
    <div class="grid gap-1.5 sm:gap-2.5 grid-cols-1 sm:grid-cols-2 max-h-[280px] overflow-y-auto pr-1">
      <PokemonCompetitiveMoveCard
        v-for="move in props.category.moves"
        :key="`${props.category.key}-${move.name}`"
        :move="move"
      />
    </div>
  </div>
</template>
