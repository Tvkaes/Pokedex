<script setup lang="ts">
import type { PokemonDisplayData } from '@/types/pokemon.types'
import PokemonTypeBadge from '@pokedex/components/shared/PokemonTypeBadge.vue'

defineProps<{
  pokemon: PokemonDisplayData
  imperialHeight: string
  imperialWeight: string
}>()
</script>

<template>
  <div class="space-y-4 sm:space-y-6 text-left">
    <div class="space-y-1 sm:space-y-2">
      <p class="text-xs sm:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/80">
        #{{ pokemon.id.toString().padStart(3, '0') }}
      </p>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-semibold leading-tight">
        {{ pokemon.name }}
      </h1>
    </div>

    <div class="space-y-1 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/90">
      <p>
        Height ·
        <span class="font-mono tracking-normal">{{ imperialHeight }}</span>
      </p>
      <p>
        Weight ·
        <span class="font-mono tracking-normal">{{ imperialWeight }}</span>
      </p>
    </div>

    <p class="text-sm sm:text-base max-w-md leading-relaxed text-white/90 line-clamp-4">
      {{ pokemon.description || 'Description not available yet. Try another species.' }}
    </p>

    <div class="flex flex-wrap gap-2 sm:gap-3">
      <PokemonTypeBadge v-for="type in pokemon.types" :key="type.type.name" :label="type.type.name" />
    </div>
  </div>
</template>
