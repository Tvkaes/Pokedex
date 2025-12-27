<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonGridEntry } from '@/types/pokemon.types'
import PokemonGridCard from './PokemonGridCard.vue';


const props = defineProps<{
  entries: PokemonGridEntry[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

const hasEntries = computed(() => props.entries.length > 0)

function handleSelect(id: number) {
  emit('select', id)
}
</script>

<template>
  <div class="min-h-screen w-full px-4 pb-12 pt-28 sm:px-8 lg:px-16">
    <div v-if="isLoading" class="flex min-h-[50vh] items-center justify-center">
      <div class="text-center uppercase tracking-[0.4em] text-white/80">
        Loading entries...
      </div>
    </div>

    <TransitionGroup v-else-if="hasEntries" name="grid-fade" tag="div" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <PokemonGridCard v-for="entry in entries" :key="entry.id" :entry="entry" @select="handleSelect" />
    </TransitionGroup>

    <div v-else class="flex min-h-[50vh] items-center justify-center text-center text-white/70">
      No Pokémon entries loaded for this generation yet.
    </div>
  </div>
</template>

<style scoped>
.grid-fade-enter-active,
.grid-fade-leave-active {
  transition: all 0.4s ease;
}

.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
