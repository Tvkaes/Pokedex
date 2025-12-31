<script setup lang="ts">
import type { CompetitiveMoveRecommendation } from '@/types/pokemon.types'

const props = defineProps<{
  move: CompetitiveMoveRecommendation
}>()

function formatMoveLabel(name: string): string {
  return name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function formatRoleTag(tag: string): string {
  return tag
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}
</script>

<template>
  <div
    class="rounded-lg border border-white/10 bg-black/45 p-2.5 flex flex-col gap-1 shadow-inner transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-black/55"
  >
    <p class="text-[11px] md:text-xs font-semibold text-white leading-tight">{{ formatMoveLabel(props.move.name) }}</p>
    <p class="text-[6px] md:text-[7px] uppercase tracking-[0.4em] text-white/60">
      <span class="text-white/50">{{ formatRoleTag(props.move.roleTag) }}</span>
    </p>
  </div>
</template>
