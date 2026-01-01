<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { POPULAR_POKEMON } from '@/utils/constants'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    loading?: boolean
    placeholder?: string
    suggestions?: string[]
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

function handleSearch() {
  const trimmed = value.value.trim()
  if (!trimmed) return
  emit('search', trimmed)
}

function handleRandom() {
  emit('random')
}

function handleSuggestionSelect(name: string) {
  value.value = name
  emit('update:modelValue', name)
  emit('search', name)
}

const filteredSuggestions = computed(() => {
  const baseSuggestions = props.suggestions?.length ? props.suggestions : POPULAR_POKEMON
  if (!value.value.trim()) return baseSuggestions.slice(0, 8)
  const query = value.value.trim().toLowerCase()
  const matches = baseSuggestions.filter((entry) => entry.toLowerCase().includes(query))
  return matches.slice(0, 8)
})

const showSuggestions = computed(() => filteredSuggestions.value.length > 0 && (isFocused.value || value.value.length > 0))
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
        @keydown.enter.prevent="handleSearch"
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
        @click="handleSearch"
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
      <button
        v-for="suggestion in filteredSuggestions"
        :key="suggestion"
        class="search-bar__suggestion"
        type="button"
        @mousedown.prevent
        @click="handleSuggestionSelect(suggestion)"
      >
        {{ suggestion }}
      </button>
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
