<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { usePokemonDataStore } from '@/stores/pokemonData'
import { usePokemonViewStore } from '@/stores/pokemonView'
import PokemonHeroView from '@pokedex/components/hero/PokemonHeroView.vue'
import PokemonGridView from '@pokedex/components/grid/PokemonGridView.vue'
import PokedexViewToggle from '@pokedex/components/controls/PokedexViewToggle.vue'
import PokedexGenerationFilterPanel from '@pokedex/components/filters/PokedexGenerationFilterPanel.vue'
import { POKEMON_GENERATIONS, DEFAULT_GENERATION_ID } from '@pokedex/data/generations'
import StripeAuraBackground from '@/components/backgrounds/StripeAuraBackground.vue'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton.vue'
import { useScrollTopButton } from '@/composables/useScrollTopButton'
import { useHeroTheme } from '@/composables/useHeroTheme'
import PokedexSearchPanel from '@/components/pokemon/PokedexSearchPanel.vue'
import { usePokedexSearch } from '@/composables/usePokedexSearch'
import { useTranslation } from '@/composables/useTranslation'

const { t, locale } = useTranslation()


const dataStore = usePokemonDataStore()
const viewStore = usePokemonViewStore()

const accentType = computed(() => dataStore.primaryType)
const secondaryType = computed(() => dataStore.pokemon?.types?.[1]?.type?.name ?? null)

const {
  heroColor,
  secondaryHeroColor,
  heroGradientStyle,
  handleThemeChange,
} = useHeroTheme(accentType, secondaryType)

const isHeroView = computed(() => viewStore.viewMode === 'hero')
const isGridView = computed(() => viewStore.viewMode === 'grid')
const generationEntries = computed(() => dataStore.getGenerationEntries(viewStore.activeGeneration))

const { showScrollTop, scrollToTop } = useScrollTopButton(isGridView)
const { searchValue, isSearching, activeError, suggestionPool, toastMessage, performSearch, searchRandomPokemon, dismissToast } =
  usePokedexSearch()

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

function handleSwitch(mode: 'hero' | 'grid' | 'search') {
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

watch(
  () => locale.value,
  (newLocale, oldLocale) => {
    if (newLocale === oldLocale) return
    dataStore.loadGenerationEntries(viewStore.activeGeneration, {
      forceRefresh: true,
      locale: newLocale,
    })
  }
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

    <div class="absolute left-0 right-0 top-0 z-30 flex items-center justify-end gap-4 px-6 py-6">
      <PokedexViewToggle :active="viewStore.viewMode" @switch="handleSwitch" />
   
    </div>

    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="toastMessage" class="search-toast" role="status">
          <span>{{ toastMessage }}</span>
          <button type="button" aria-label="Dismiss" @click="dismissToast">✕</button>
        </div>
      </Transition>
    </Teleport>

    <Transition name="view-fade" mode="out-in">
      <template v-if="isHeroView">
        <template v-if="dataStore.pokemon">
          <PokemonHeroView
            :pokemon="dataStore.pokemon"
            :primary-type="accentType"
            class="relative z-20"
            @select="handleSelect"
            @theme-change="handleThemeChange"
          />
        </template>
        <div v-else-if="dataStore.isLoading" key="hero-loading" class="min-h-screen flex items-center justify-center">
          <div class="text-center text-white/80 uppercase tracking-[0.4em] space-y-4">
            <div class="w-16 h-16 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p>{{ t('loading.entry') }}</p>
          </div>
        </div>
        <div v-else key="hero-empty" class="min-h-screen flex items-center justify-center"></div>
      </template>
      <div v-else-if="isGridView" key="grid-view" class="relative z-20 min-h-screen pt-6">
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
      <div v-else key="search-view" class="search-view relative z-20 min-h-screen">
        <div class="search-view__aura" aria-hidden="true" />
        <span class="search-view__kanji" aria-hidden="true">ポケモン図鑑</span>
        <div class="search-view__content">
          <PokedexSearchPanel
            v-model="searchValue"
            :loading="isSearching"
            :error="activeError ?? undefined"
            :suggestions="suggestionPool"
            @search="performSearch"
            @random="searchRandomPokemon"
          />
        </div>
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

.view-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.search-view {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 7.5rem 1.5rem 3.5rem;
}

.search-view__aura {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, rgba(59, 130, 246, 0.25), transparent 50%),
    radial-gradient(circle at bottom, rgba(236, 72, 153, 0.18), transparent 55%);
  filter: blur(90px);
  animation: pulseGlow 8s ease-in-out infinite alternate;
}

.search-view__content {
  position: relative;
  width: min(960px, 100%);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.search-view__kanji {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(4rem, 14vw, 12rem);
  font-weight: 800;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.07);
  pointer-events: none;
  user-select: none;
  text-transform: none;
}

.search-hero__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.75rem;
}

.search-hero__title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 0.75rem;
}

.search-hero__subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  max-width: 40rem;
}

.search-toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.2rem;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fee2e2;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.65rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
}

.search-toast button {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) translateX(10px);
}

@keyframes pulseGlow {
  from {
    opacity: 0.7;
  }
  to {
    opacity: 1;
    transform: scale(1.05);
  }
}
</style>
