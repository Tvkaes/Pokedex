<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonHeroView from '@pokedex/components/hero/PokemonHeroView.vue'
import PokemonGridView from '@pokedex/components/grid/PokemonGridView.vue'
import PokedexViewToggle from '@pokedex/components/controls/PokedexViewToggle.vue'
import PokedexGenerationFilterPanel from '@pokedex/components/filters/PokedexGenerationFilterPanel.vue'
import { getTypeColor } from '@/utils/typeColors'
import { POKEMON_GENERATIONS, DEFAULT_GENERATION_ID } from '@pokedex/data/generations'

const store = usePokemonStore()

const accentType = computed(() => store.primaryType)
const heroColor = computed(() => getTypeColor(accentType.value))
const isHeroView = computed(() => store.viewMode === 'hero')
const generationEntries = computed(() => store.generationEntries[store.activeGeneration] ?? [])

function handleRandom() {
  const randomId = Math.floor(Math.random() * 898) + 1
  store.loadPokemon(randomId)
}

function handleSelect(id: number) {
  store.loadPokemon(id)
}

function handleSwitch(mode: 'hero' | 'grid') {
  store.setViewMode(mode)
}

function handleGenerationSelect(id: string) {
  store.setActiveGeneration(id)
  store.loadGenerationEntries(id)
}

watch(
  () => store.viewMode,
  (mode) => {
    if (mode === 'grid') {
      store.loadGenerationEntries(store.activeGeneration)
    }
  },
  { immediate: false }
)

onMounted(() => {
  handleRandom()
  store.loadGenerationEntries(DEFAULT_GENERATION_ID)
})
</script>

<template>
  <section
    class="relative min-h-screen w-full overflow-hidden text-white transition-colors duration-500"
    :style="{ backgroundColor: heroColor.color || '#B3272C' }"
  >
    <div class="absolute left-0 right-0 top-0 z-20 flex justify-end px-6 py-6">
      <PokedexViewToggle :active="store.viewMode" @switch="handleSwitch" />
    </div>

    <Transition name="view-fade" mode="out-in">
      <template v-if="isHeroView">
        <template v-if="store.pokemon">
          <PokemonHeroView :pokemon="store.pokemon" :primary-type="accentType" @select="handleSelect" />
        </template>
        <div v-else-if="store.isLoading" key="hero-loading" class="min-h-screen flex items-center justify-center">
          <div class="text-center text-white/80 uppercase tracking-[0.4em] space-y-4">
            <div class="w-16 h-16 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p>Loading entry...</p>
          </div>
        </div>
        <div v-else key="hero-empty" class="min-h-screen flex items-center justify-center"></div>
      </template>
      <div v-else key="grid-view" class="relative z-10 min-h-screen pt-6">
        <PokedexGenerationFilterPanel
          :generations="POKEMON_GENERATIONS"
          :active-id="store.activeGeneration"
          :loading="store.isGenerationLoading"
          @select="handleGenerationSelect"
        />
        <PokemonGridView
          :entries="generationEntries"
          :is-loading="store.isGenerationLoading"
          @select="handleSelect"
        />
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.view-fade-enter-from,
.view-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>

