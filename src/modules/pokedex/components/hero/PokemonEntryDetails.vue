<script setup lang="ts">
import type { PokemonDisplayData } from '@/types/pokemon.types'

const props = defineProps<{
  pokemon: PokemonDisplayData
}>()
</script>

<template>
  <div class="space-y-2 text-white/80">
    <p class="type-subtitle text-white/90">
      {{ pokemon.description }}
    </p>
    <p class="type-caption text-white/60">
      Also known as {{ pokemon.name }} in its native regions.
    </p>
  </div>
</template>
