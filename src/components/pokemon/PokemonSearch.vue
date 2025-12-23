<script setup lang="ts">
import { ref, watch } from 'vue'
import { POPULAR_POKEMON } from '@/utils/constants'

const props = withDefaults(defineProps<{
  modelValue?: string
  loading?: boolean
}>(), {
  modelValue: '',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
  random: []
}>()

const value = ref(props.modelValue)
const isFocused = ref(false)

watch(() => props.modelValue, (newValue) => {
  value.value = newValue
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  value.value = target.value
  emit('update:modelValue', target.value)
}

function handleSubmit() {
  if (!value.value.trim()) return
  emit('search', value.value.trim().toLowerCase())
}

function handleSuggestion(name: string) {
  emit('update:modelValue', name)
  emit('search', name)
}
</script>

<template>
  <div class="space-y-4">
    <label class="block uppercase tracking-[0.3em] text-xs text-white/60">Buscar Pokémon</label>
    <div class="relative">
      <input
        type="text"
        :value="value"
        class="input input-lg w-full rounded-2xl bg-white/5 border border-white/10 text-lg text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
        placeholder="Nombre o número..."
        :disabled="loading"
        @input="handleInput"
        @keydown.enter.prevent="handleSubmit"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <span v-if="loading" class="loading loading-spinner loading-sm text-primary" />
        <button
          class="btn btn-sm btn-circle btn-ghost text-white/60"
          :class="{ 'opacity-0 pointer-events-none': !value }"
          type="button"
          @mousedown.prevent
          @click="emit('update:modelValue', ''); value = ''"
        >
          ✕
        </button>
      </div>
      <div
        class="absolute inset-0 rounded-2xl border border-primary/40 pointer-events-none transition-opacity"
        :class="isFocused ? 'opacity-100' : 'opacity-0'"
      />
    </div>
    <div class="flex flex-wrap gap-2 text-sm text-white/60 uppercase tracking-[0.2em]">
      <span>Sugerencias:</span>
      <button
        v-for="suggestion in POPULAR_POKEMON"
        :key="suggestion"
        class="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/30 hover:text-white transition"
        type="button"
        @click="handleSuggestion(suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>
    <div class="flex flex-wrap gap-4">
      <button class="btn btn-primary rounded-2xl px-8" type="button" :disabled="loading" @click="handleSubmit">
        Buscar
      </button>
      <button class="btn btn-ghost rounded-2xl px-8 text-white/70" type="button" :disabled="loading" @click="$emit('random')">
        Aleatorio
      </button>
    </div>
  </div>
</template>
