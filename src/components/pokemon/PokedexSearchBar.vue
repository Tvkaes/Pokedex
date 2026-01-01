<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { POPULAR_POKEMON } from '@/utils/constants'
import type { SearchSuggestion } from '@/types/search.types'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    loading?: boolean
    placeholder?: string
    suggestions?: SearchSuggestion[]
  }>(),
  {
    modelValue: '',
    loading: false,
    placeholder: 'Name or number...',
    suggestions: () => [],
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
  random: []
}>()

const value = ref(props.modelValue)
const isFocused = ref(false)
const highlightedIndex = ref(0)
const debouncedQuery = ref(value.value)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

const normalizedSuggestions = computed<SearchSuggestion[]>(() => {
  if (!props.suggestions?.length) {
    return POPULAR_POKEMON.map((name) => ({ name }))
  }
  return props.suggestions.map((entry) => (typeof entry === 'string' ? { name: entry } : entry))
})

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  return matrix[a.length][b.length]
}

function computeScore(name: string, query: string) {
  const normalizedName = name.toLowerCase()
  const normalizedQuery = query.toLowerCase()

  if (normalizedName === normalizedQuery) return 0
  if (normalizedName.startsWith(normalizedQuery)) return 1
  if (normalizedName.includes(normalizedQuery)) return 2

  const distance = levenshtein(normalizedName, normalizedQuery)
  const tolerance = Math.max(1, Math.ceil(normalizedQuery.length / 3))
  if (distance <= tolerance) {
    return 3 + distance / 10
  }
  return Infinity
}

const rankedSuggestions = computed(() => {
  const list = normalizedSuggestions.value
  const query = debouncedQuery.value.trim()
  if (!query) {
    return list.slice(0, 8)
  }

  const scored = list
    .map((entry) => ({
      entry,
      score: computeScore(entry.name, query),
    }))
    .filter((result) => Number.isFinite(result.score))
    .sort((a, b) => {
      if (a.score === b.score) {
        return a.entry.name.localeCompare(b.entry.name)
      }
      return a.score - b.score
    })

  return scored.map((result) => result.entry).slice(0, 8)
})

const hasSuggestions = computed(() => rankedSuggestions.value.length > 0)
const showSuggestions = computed(() => (isFocused.value || value.value.length > 0) && (hasSuggestions.value || !!debouncedQuery.value.trim()))

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue
  }
)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  value.value = target.value
  emit('update:modelValue', target.value)
  highlightedIndex.value = 0
}

function handleSearchFromInput() {
  const trimmed = value.value.trim()
  if (!trimmed && rankedSuggestions.value.length) {
    const suggestions = rankedSuggestions.value
    const safeIndex = Math.min(Math.max(highlightedIndex.value, 0), suggestions.length - 1)
    const fallback = suggestions[safeIndex] ?? suggestions[0]
    if (fallback) {
      handleSuggestionSelect(fallback)
    }
    return
  }
  if (!trimmed) return
  emit('search', trimmed)
}

function handleRandom() {
  emit('random')
}

function handleSuggestionSelect(suggestion: SearchSuggestion | string | undefined) {
  if (!suggestion) return
  const name = typeof suggestion === 'string' ? suggestion : suggestion.name
  value.value = name
  emit('update:modelValue', name)
  emit('search', name)
}

function moveHighlight(delta: number) {
  const count = rankedSuggestions.value.length
  if (!count) return
  highlightedIndex.value = (highlightedIndex.value + delta + count) % count
}

function handleKeyEnter(event: KeyboardEvent) {
  event.preventDefault()
  handleSearchFromInput()
}

function handleKeyArrowDown(event: KeyboardEvent) {
  event.preventDefault()
  moveHighlight(1)
}

function handleKeyArrowUp(event: KeyboardEvent) {
  event.preventDefault()
  moveHighlight(-1)
}

watch(
  () => value.value,
  (newValue) => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      debouncedQuery.value = newValue
    }, 160)
  },
  { immediate: true }
)

watch(
  () => rankedSuggestions.value.length,
  (length) => {
    if (highlightedIndex.value >= length) {
      highlightedIndex.value = 0
    }
  }
)

onBeforeUnmount(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
})

</script>

<template>
  <label class="sr-only" for="pokedex-searchbar-input">Search Pokémon</label>
  <div class="search-bar-wrapper">
    <div class="search-bar" :class="{ 'search-bar--loading': loading }">
      <svg class="search-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <line x1="16" y1="16" x2="21" y2="21" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <input
        id="pokedex-searchbar-input"
        :value="value"
        class="search-bar__input"
        type="text"
        :placeholder="placeholder"
        :disabled="loading"
        autocomplete="off"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown.enter="handleKeyEnter"
        @keydown.arrow-down="handleKeyArrowDown"
        @keydown.arrow-up="handleKeyArrowUp"
      />
      <button
        class="search-bar__button"
        type="button"
        aria-label="Random Pokémon"
        :disabled="loading"
        @click="handleRandom"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4.5 7.5h4l2 3-2 3h-4m11-6h4l-2 3 2 3h-4m-4-6 3 6m-3 0L9 7.5"
            fill="none"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="sr-only">Random Pokémon</span>
      </button>
      <button
        class="search-bar__button search-bar__button--primary"
        type="button"
        aria-label="Search Pokédex"
        :disabled="loading"
        @click="handleSearchFromInput"
      >
        <span v-if="loading" class="search-bar__spinner" aria-hidden="true" />
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12h9m0 0-3-3m3 3-3 3m5-10h4v4"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div v-if="showSuggestions" class="search-bar__suggestions">
      <template v-if="hasSuggestions">
        <button
          v-for="(suggestion, index) in rankedSuggestions"
          :key="suggestion.name"
          class="search-bar__suggestion"
          :class="{ 'search-bar__suggestion--active': index === highlightedIndex }"
          type="button"
          @mousedown.prevent
          @mouseenter="highlightedIndex = index"
          @click="handleSuggestionSelect(suggestion)"
        >
          <span class="search-bar__suggestion-name">{{ suggestion.name }}</span>
          <span v-if="suggestion.formattedId" class="search-bar__suggestion-id">{{ suggestion.formattedId }}</span>
        </button>
      </template>
      <p v-else class="search-bar__empty">No results found</p>
    </div>
  </div>
</template>

<style scoped>
.search-bar-wrapper {
  position: relative;
  width: 100%;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: clamp(0.9rem, 3vw, 1.15rem) clamp(1.25rem, 4vw, 1.75rem);
  background: rgba(255, 255, 255, 0.04);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 30px 60px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
}

.search-bar--loading {
  opacity: 0.85;
}

.search-bar__icon {
  width: 1.5rem;
  height: 1.5rem;
  stroke: rgba(255, 255, 255, 0.5);
  fill: none;
}

.search-bar__input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  outline: none;
}

.search-bar__input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.search-bar__button {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.04);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  color: white;
}

.search-bar__button svg {
  width: 1.3rem;
  height: 1.3rem;
  stroke: currentColor;
  fill: none;
}

.search-bar__button--primary {
  border: none;
  background: linear-gradient(120deg, #ffffff, #c7d2fe);
  color: #020617;
  box-shadow: 0 12px 30px rgba(255, 255, 255, 0.25);
}

.search-bar__button:disabled {
  opacity: 0.7;
  pointer-events: none;
}

.search-bar__button:not(:disabled):hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.search-bar__button--primary:not(:disabled):hover {
  transform: translateY(-1px) scale(1.02);
}

.search-bar__spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(2, 6, 23, 0.2);
  border-top-color: #020617;
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

.search-bar__suggestions {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-bar__suggestion {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.75);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.search-bar__suggestion:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.12);
}

.search-bar__suggestion--active {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.search-bar__suggestion-name {
  font-weight: 600;
  letter-spacing: 0.15em;
}

.search-bar__suggestion-id {
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  margin-left: 0.6rem;
  color: rgba(255, 255, 255, 0.6);
}

.search-bar__empty {
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.4rem 0.9rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
