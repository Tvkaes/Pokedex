<script setup lang="ts">
import HeadingBlock from '@/components/ui/HeadingBlock.vue'
import PokedexSearchBar from '@/components/pokemon/PokedexSearchBar.vue'
import type { SearchSuggestion } from '@/types/search.types'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

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
      :eyebrow="t('search.eyebrow')"
      :title="t('search.title')"
      :subtitle="t('search.subtitle')"
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
