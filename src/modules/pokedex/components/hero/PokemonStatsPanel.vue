<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PokemonDisplayData, CompetitiveMoveRecommendation } from '@/types/pokemon.types'
import PokemonStatRadar from './PokemonStatRadar.vue'
import PokemonCompetitiveCategoryGrid from './PokemonCompetitiveCategoryGrid.vue'
import PokemonCompetitiveCategoryDetail from './PokemonCompetitiveCategoryDetail.vue'
import { getPokemonCompetitiveMoveSets } from '@/services/pokemonService'

const props = defineProps<{
  pokemonId: number
  stats: PokemonDisplayData['stats']
  competitiveSets?: PokemonDisplayData['competitiveSets']
}>()

type CompetitiveCategory = {
  key: string
  label: string
  accent: string
  moves: CompetitiveMoveRecommendation[]
}

const localCompetitiveSets = ref<PokemonDisplayData['competitiveSets'] | null>(props.competitiveSets ?? null)
const isLoadingSets = ref(!props.competitiveSets)
let loadToken = 0

const competitiveCategories = computed<CompetitiveCategory[]>(() => {
  if (!localCompetitiveSets.value) return []
  return [
    { key: 'sweeper', label: 'Sweeper', accent: 'text-emerald-300', moves: localCompetitiveSets.value.sweeper ?? [] },
    { key: 'wallbreaker', label: 'Wallbreaker', accent: 'text-rose-300', moves: localCompetitiveSets.value.wallbreaker ?? [] },
    { key: 'tank', label: 'Tank / Stall', accent: 'text-sky-300', moves: localCompetitiveSets.value.tank ?? [] },
    { key: 'support', label: 'Support', accent: 'text-amber-200', moves: localCompetitiveSets.value.support ?? [] },
  ].filter((category) => category.moves.length)
})

const hasCompetitiveSets = computed(() => competitiveCategories.value.length > 0)

const activeCategoryKey = ref<string | null>(null)
const activeCategory = computed(() => competitiveCategories.value.find((category) => category.key === activeCategoryKey.value) ?? null)

function handleCategorySelect(key: string) {
  const category = competitiveCategories.value.find((entry) => entry.key === key)
  if (!category || !category.moves.length) return
  activeCategoryKey.value = key
}

function resetCategoryView() {
  activeCategoryKey.value = null
}

watch(
  () => props.competitiveSets,
  (sets) => {
    if (typeof sets === 'undefined') return
    localCompetitiveSets.value = sets ?? null
    activeCategoryKey.value = null
    isLoadingSets.value = false
  }
)

async function loadCompetitiveSets(pokemonId?: number | null) {
  if (!pokemonId) {
    localCompetitiveSets.value = null
    isLoadingSets.value = false
    return
  }

  const token = ++loadToken
  isLoadingSets.value = true
  try {
    const sets = await getPokemonCompetitiveMoveSets(pokemonId)
    if (token === loadToken) {
      localCompetitiveSets.value = sets
      activeCategoryKey.value = null
    }
  } catch (error) {
    console.warn(`Failed to fetch competitive sets for pokemon ${pokemonId}`, error)
    if (token === loadToken) {
      localCompetitiveSets.value = null
    }
  } finally {
    if (token === loadToken) {
      isLoadingSets.value = false
    }
  }
}

watch(
  () => props.pokemonId,
  (id) => {
    if (props.competitiveSets && props.competitiveSets !== null) {
      localCompetitiveSets.value = props.competitiveSets
      isLoadingSets.value = false
      return
    }
    void loadCompetitiveSets(id)
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-2.5">
    <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-2.5 sm:p-3">
      <div class="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-4">
        <div class="flex flex-col items-center gap-1 md:w-auto text-[9px] uppercase tracking-[0.25em] text-white/50">
          <div class="scale-[0.82] md:scale-[0.9] lg:scale-100 origin-top">
            <PokemonStatRadar :stats="stats" />
          </div>
        </div>
        <div class="flex-1">
          <div class="rounded-2xl border border-white/10 bg-white/5/5 p-2 sm:p-3 lg:p-3.5 flex flex-col gap-2 sm:gap-2.5">
            <div class="flex items-center justify-between">
              <p class="text-[9px] uppercase tracking-[0.35em] text-white/60">Competitive Move Sets</p>
            </div>
            <div class="relative min-h-[100px]">
              <div
                v-if="isLoadingSets"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 text-white/70 text-[9px] uppercase tracking-[0.35em]"
              >
                <div class="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <p>Cargando sets...</p>
              </div>
              <Transition v-else-if="hasCompetitiveSets" name="panel-fade" mode="out-in">
                <PokemonCompetitiveCategoryGrid
                  v-if="!activeCategory"
                  key="grid"
                  :categories="competitiveCategories"
                  @select="handleCategorySelect"
                />
                <PokemonCompetitiveCategoryDetail
                  v-else
                  key="detail"
                  :category="activeCategory"
                  @back="resetCategoryView"
                />
              </Transition>
              <div
                v-else
                class="rounded-2xl border border-dashed border-white/15 p-6 text-center text-white/40 text-xs uppercase tracking-[0.3em]"
              >
                Este Pokémon aún no tiene sets competitivos disponibles.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
