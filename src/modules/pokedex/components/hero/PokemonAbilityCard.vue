<script setup lang="ts">
import type { PokemonDisplayData } from '@/types/pokemon.types'

const props = defineProps<{
  pokemon: PokemonDisplayData
}>()
</script>

<template>
  <div class="space-y-3 text-white">
    <div
      v-if="pokemon.featuredAbility"
      class="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm shadow-lg shadow-white/5"
    >
      <p class="text-xs uppercase tracking-[0.3em] text-white/60">Star Ability</p>
      <h3 class="mt-2 text-2xl font-semibold tracking-tight">
        {{ pokemon.featuredAbility.name }}
      </h3>
      <p class="mt-1 text-sm text-white/70">
        {{ pokemon.featuredAbility.isHidden ? 'Hidden ability' : 'Signature move' }} that defines this species.
      </p>
      <p v-if="pokemon.featuredAbility.description" class="mt-3 text-sm text-white/80 leading-relaxed">
        {{ pokemon.featuredAbility.description }}
      </p>
      <p v-else class="mt-3 text-sm text-white/60">
        No additional description available for this ability.
      </p>
    </div>
    <p v-else class="text-sm text-white/70">No featured ability available for this Pokémon.</p>
  </div>
</template>
