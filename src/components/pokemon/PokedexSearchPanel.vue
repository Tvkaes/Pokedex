<script setup lang="ts">
import HeadingBlock from '@/components/ui/HeadingBlock.vue'
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
    <HeadingBlock
      class="search-panel__hero"
      eyebrow="Pokédex"
      title="Instantly jump to any species in cinematic view."
      subtitle="Enter a name or National Dex number and we will take you right to the hero experience."
      size="lg"
    />

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

.search-panel__hero {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-panel__error {
  font-size: 0.9rem;
  color: #fecaca;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
