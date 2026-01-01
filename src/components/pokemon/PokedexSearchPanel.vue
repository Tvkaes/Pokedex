<script setup lang="ts">
import PokedexSearchBar from '@/components/pokemon/PokedexSearchBar.vue'
import type { SearchSuggestion } from '@/types/search.types'

const props = defineProps<{
  modelValue: string
  loading: boolean
  error?: string | null
  suggestions?: SearchSuggestion[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query?: string]
  random: []
}>()
</script>

<template>
  <div class="search-panel">
    <div class="search-panel__hero" v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.05 } } }">
      <p class="search-panel__eyebrow">Pokédex</p>
      <h2 class="search-panel__title">Instantly jump to any species in cinematic view.</h2>
      <p class="search-panel__subtitle">Enter a name or National Dex number and we will take you right to the hero experience.</p>
    </div>

    <PokedexSearchBar
      :model-value="props.modelValue"
      :loading="props.loading"
      :suggestions="props.suggestions"
      @update:model-value="(value) => emit('update:modelValue', value)"
      @search="(query) => emit('search', query)"
      @random="emit('random')"
    />
  </div>
</template>

<style scoped>
.search-panel {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.search-panel__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.75rem;
}

.search-panel__title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 0.75rem;
}

.search-panel__subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  max-width: 40rem;
}

.search-panel__error {
  font-size: 0.9rem;
  color: #fecaca;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
