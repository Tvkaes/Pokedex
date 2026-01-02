<script setup lang="ts">
import PokemonTypeBadge from '@pokedex/components/shared/PokemonTypeBadge.vue'
import GlassPanel from '@/components/ui/GlassPanel.vue'

type MatchupEntry = {
  type: string
  value: string
  tone?: 'success' | 'danger' | 'neutral'
  meta?: string
}

const props = withDefaults(
  defineProps<{
    kicker: string
    title: string
    entries: MatchupEntry[]
    emptyMessage: string
  }>(),
  {
    entries: () => [],
  }
)




</script>

<template>
  <GlassPanel
    padding="md"
    class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5/5 backdrop-blur-xl sm:gap-4"
  >
    <header>
      <p class="text-[0.50rem] uppercase tracking-[0.35em] text-white/60 mb-1">{{ kicker }}</p>
      <h3 class="font-display text-md uppercase tracking-[0.08em] text-white sm:text-lg">
        {{ title }}
      </h3>
    </header>

    <div v-if="entries.length" class="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-1.5">
      <div
        v-for="entry in entries"
        :key="entry.type"
        class="flex items-center justify-between gap-2 rounded-2xl py-1.5 "
      >
        <div class="flex flex-col gap-0.5">
          <PokemonTypeBadge :label="entry.type" />
          <p v-if="entry.meta" class="text-[0.5rem] uppercase tracking-[0.3em] text-white/40 leading-none">
            {{ entry.meta }}
          </p>
        </div>
        
      </div>
    </div>

    <p v-else class="text-xs text-white/60 sm:text-sm">{{ emptyMessage }}</p>
  </GlassPanel>
</template>
