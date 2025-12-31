<script setup lang="ts">
import type { PokemonDisplayData } from '@/types/pokemon.types'

const props = defineProps<{
  pokemon: PokemonDisplayData
}>()
</script>

<template>
  <div class="space-y-2 text-white/80">
    <p class="text-sm sm:text-base leading-relaxed text-white/90">
      {{ pokemon.description }}
    </p>
    <p class="text-xs uppercase tracking-[0.3em] text-white/50">
      Also known as {{ pokemon.name }} in its native regions.
    </p>
  </div>
</template>
