import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_GENERATION_ID } from '@pokedex/data/generations'

export const usePokemonViewStore = defineStore('pokemon-view', () => {
  const viewMode = ref<'hero' | 'grid'>('hero')
  const activeGeneration = ref<string>(DEFAULT_GENERATION_ID)

  function setViewMode(mode: 'hero' | 'grid') {
    viewMode.value = mode
  }

  function setActiveGeneration(id: string) {
    if (activeGeneration.value === id) return
    activeGeneration.value = id
  }

  return {
    viewMode,
    activeGeneration,
    setViewMode,
    setActiveGeneration,
  }
})
