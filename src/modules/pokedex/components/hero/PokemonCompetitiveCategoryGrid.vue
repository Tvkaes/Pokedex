<script setup lang="ts">
import type { CompetitiveMoveRecommendation } from '@/types/pokemon.types'

const props = defineProps<{
  categories: Array<{
    key: string
    label: string
    accent: string
    moves: CompetitiveMoveRecommendation[]
  }>
}>()

const emit = defineEmits<{
  select: [key: string]
}>()

const CATEGORY_GRADIENTS: Record<string, string> = {
  sweeper: 'bg-gradient-to-br from-emerald-400/40 via-emerald-300/20 to-emerald-100/10',
  wallbreaker: 'bg-gradient-to-br from-rose-400/40 via-rose-300/20 to-rose-100/10',
  tank: 'bg-gradient-to-br from-sky-400/40 via-sky-300/20 to-sky-100/10',
  support: 'bg-gradient-to-br from-amber-300/40 via-amber-200/20 to-amber-50/10',
}

function handleSelect(key: string) {
  emit('select', key)
}
</script>

<template>
  <div class="grid gap-2.5 sm:gap-3 grid-cols-2">
    <button
      v-for="category in props.categories"
      :key="category.key"
      type="button"
      :class="[
        'rounded-lg border border-white/5 px-2.5 py-2.5 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:border-white/25',
        CATEGORY_GRADIENTS[category.key] ?? 'bg-white/5 hover:bg-white/10',
        CATEGORY_GRADIENTS[category.key] ? 'hover:opacity-95' : '',
      ]"
      @click="handleSelect(category.key)"
    >
      <p class="text-[9px] font-semibold tracking-[0.3em] text-white">{{ category.label }}</p>
    </button>
  </div>
</template>
