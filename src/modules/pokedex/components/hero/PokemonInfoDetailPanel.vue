<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonAlternateForm, PokemonDisplayData } from '@/types/pokemon.types'
import type { PokemonInfoSectionId } from '@pokedex/types/pokemon-info.types'
import PokemonFormVariantCard from './PokemonFormVariantCard.vue'

const props = defineProps<{
  pokemon: PokemonDisplayData
  section: PokemonInfoSectionId
  megaForms: PokemonAlternateForm[]
  hasMegaEvolution: boolean
  activeMegaFormIndex: number | null
}>()

const emit = defineEmits<{
  selectForm: [index: number | null]
}>()

const isBaseActive = computed(() => props.activeMegaFormIndex === null)
const hasForms = computed(() => props.hasMegaEvolution && props.megaForms.length > 0)
const formEntries = computed(() =>
  props.megaForms.map((form, index) => ({
    form,
    index,
    secondaryType: form.types?.[1]?.type?.name ?? null,
  }))
)
const visibleFormEntries = computed(() => {
  if (!hasForms.value) return []
  if (isBaseActive.value) return formEntries.value
  const activeIndex = props.activeMegaFormIndex
  return formEntries.value.filter(({ index }) => index !== activeIndex)
})

function handleFormSelect(index: number | null) {
  emit('selectForm', index)
}
</script>

<template>
  <div>
    <div v-if="section === 'entry'" class="text-sm text-white/80 space-y-2">
      <p class="text-sm sm:text-base leading-relaxed text-white/90">
        {{ pokemon.description }}
      </p>
      <p class="text-white/60">
        Also known as {{ pokemon.name }} in its native regions.
      </p>
    </div>

    <div v-else-if="section === 'stats'" class="space-y-3">
      <div
        v-for="stat in pokemon.stats"
        :key="stat.label"
        class="space-y-1"
      >
        <div class="flex justify-between text-xs text-white/70 font-mono">
          <span>{{ stat.label }}</span>
          <span>{{ stat.value }}</span>
        </div>
        <div class="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <span
            class="block h-full rounded-full bg-gradient-to-r from-white to-white/60"
            :style="{ width: `${stat.percentage}%` }"
          />
        </div>
      </div>
    </div>

    <div v-else-if="section === 'ability'" class="space-y-3">
      <div
        v-if="pokemon.featuredAbility"
        class="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm shadow-lg shadow-white/5"
      >
        <p class="text-xs uppercase tracking-[0.3em] text-white/60">Star Ability</p>
        <h3 class="mt-2 text-2xl font-semibold tracking-tight text-white">
          {{ pokemon.featuredAbility.name }}
        </h3>
        <p class="mt-1 text-sm text-white/70">
          {{ pokemon.featuredAbility.isHidden ? 'Hidden ability' : 'Signature move' }} that defines this species.
        </p>
        <p v-if="pokemon.featuredAbility.description" class="mt-3 text-sm text-white/80 leading-relaxed">
          {{ pokemon.featuredAbility.description }}
        </p>
        <p v-else class="mt-3 text-sm text-white/60">
          No additional description available for this ability.
        </p>
      </div>
      <p v-else class="text-sm text-white/70">No featured ability available for this Pokémon.</p>
    </div>

    <div v-else-if="section === 'forms'" class="space-y-4">
      <div v-if="hasForms" class="space-y-3">
        <Transition name="fade" mode="out-in">
          <div class="space-y-3">
            <div v-if="!isBaseActive" class="space-y-2">
              <button
                type="button"
                class="w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/90 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                @click="handleFormSelect(null)"
              >
                Volver a estado base
              </button>
              <p class="text-[11px] uppercase tracking-[0.4em] text-white/40">Otras formas</p>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              <PokemonFormVariantCard
                v-for="entry in visibleFormEntries"
                :key="entry.form.id"
                :title="entry.form.name"
                :variant-kind="entry.form.variantKind"
                :region="entry.form.region"
                :primary-type="entry.form.primaryType"
                :secondary-type="entry.secondaryType"
                hint="Preview in hero"
                @select="handleFormSelect(entry.index)"
              />
            </div>
          </div>
        </Transition>
      </div>
      <p v-else class="text-sm text-white/60">No alternate forms available for this Pokémon.</p>
    </div>
  </div>
</template>

