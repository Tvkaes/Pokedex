<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { usePokemonDataStore } from '@/stores/pokemonData'
import { usePokemonViewStore } from '@/stores/pokemonView'
import PokemonHeroView from '@pokedex/components/hero/PokemonHeroView.vue'
import PokemonGridView from '@pokedex/components/grid/PokemonGridView.vue'
import PokedexViewToggle from '@pokedex/components/controls/PokedexViewToggle.vue'
import PokedexGenerationFilterPanel from '@pokedex/components/filters/PokedexGenerationFilterPanel.vue'
import { getTypeColor } from '@/utils/typeColors'
import { POKEMON_GENERATIONS, DEFAULT_GENERATION_ID } from '@pokedex/data/generations'
import StripeAuraBackground from '@/components/backgrounds/StripeAuraBackground.vue'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton.vue'
import { useScrollTopButton } from '@/composables/useScrollTopButton'

const dataStore = usePokemonDataStore()
const viewStore = usePokemonViewStore()

const accentType = computed(() => dataStore.primaryType)
const heroColor = computed(() => getTypeColor(accentType.value))
const secondaryType = computed(() => dataStore.pokemon?.types?.[1]?.type?.name ?? null)
const secondaryHeroColor = computed(() => getTypeColor(secondaryType.value ?? accentType.value))
const isHeroView = computed(() => viewStore.viewMode === 'hero')
const isGridView = computed(() => viewStore.viewMode === 'grid')
const generationEntries = computed(() => dataStore.getGenerationEntries(viewStore.activeGeneration))
const heroGradientStyle = computed(() => {
  const primaryHex = heroColor.value.color || '#B3272C'
  const secondaryHex = secondaryHeroColor.value.color
  return {
    background: `radial-gradient(circle at 25% 20%, ${primaryHex} 0%, ${secondaryHex} 45%, #020617 100%)`,
    backgroundColor: primaryHex,
  }
})

const { showScrollTop, scrollToTop } = useScrollTopButton(isGridView)

function ensureInitialPokemon() {
  if (dataStore.pokemon) return Promise.resolve()
  const randomId = Math.floor(Math.random() * 898) + 1
  return dataStore.loadPokemon(randomId)
}

async function loadInitialData() {
  await Promise.all([ensureInitialPokemon(), dataStore.loadGenerationEntries(DEFAULT_GENERATION_ID)])
}

async function handleSelect(id: number) {
  await dataStore.loadPokemon(id)
  viewStore.setViewMode('hero')
}

function handleSwitch(mode: 'hero' | 'grid') {
  viewStore.setViewMode(mode)
}

function handleGenerationSelect(id: string) {
  viewStore.setActiveGeneration(id)
  dataStore.loadGenerationEntries(id)
}

watch(
  () => viewStore.viewMode,
  (mode) => {
    if (mode === 'grid') {
      dataStore.loadGenerationEntries(viewStore.activeGeneration)
    }
  },
  { immediate: false }
)

onMounted(() => {
  void loadInitialData()
})
</script>

<template>
  <section
    class="relative min-h-screen w-full overflow-hidden text-white transition-colors duration-500 bg-slate-950"
    :style="heroGradientStyle"
  >
    <StripeAuraBackground :primary-color="heroColor.color" :secondary-color="secondaryHeroColor.color" />

    <div class="absolute left-0 right-0 top-0 z-30 flex justify-end px-6 py-6">
      <PokedexViewToggle :active="viewStore.viewMode" @switch="handleSwitch" />
    </div>

    <Transition name="view-fade" mode="out-in">
      <template v-if="isHeroView">
        <template v-if="dataStore.pokemon">
          <PokemonHeroView
            :pokemon="dataStore.pokemon"
            :primary-type="accentType"
            class="relative z-20"
            @select="handleSelect"
          />
        </template>
        <div v-else-if="dataStore.isLoading" key="hero-loading" class="min-h-screen flex items-center justify-center">
          <div class="text-center text-white/80 uppercase tracking-[0.4em] space-y-4">
            <div class="w-16 h-16 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p>Loading entry...</p>
          </div>
        </div>
        <div v-else key="hero-empty" class="min-h-screen flex items-center justify-center"></div>
      </template>
      <div v-else key="grid-view" class="relative z-20 min-h-screen pt-6">
        <PokedexGenerationFilterPanel
          :generations="POKEMON_GENERATIONS"
          :active-id="viewStore.activeGeneration"
          :loading="dataStore.isGenerationLoading"
          @select="handleGenerationSelect"
        />
        <PokemonGridView
          :entries="generationEntries"
          :is-loading="dataStore.isGenerationLoading"
          @select="handleSelect"
        />
      </div>
    </Transition>

    <ScrollToTopButton v-if="isGridView" :visible="showScrollTop" @click="scrollToTop" />
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

