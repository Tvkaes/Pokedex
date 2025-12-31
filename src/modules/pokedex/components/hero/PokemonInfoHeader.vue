<script setup lang="ts">
import { computed } from 'vue'
import PokemonGridMegaToggleButton from '@pokedex/components/grid/PokemonGridMegaToggleButton.vue'
import PokemonGridDynamaxToggleButton from '@pokedex/components/grid/PokemonGridDynamaxToggleButton.vue'
import type { PokemonDisplayData, PokemonFormEntry } from '@/types/pokemon.types'

const props = defineProps<{
  pokemon: PokemonDisplayData
  hasMegaEvolution: boolean
  specialFormEntries: PokemonFormEntry[]
  activeMegaFormIndex: number | null
}>()

const megaFormEntries = computed(() =>
  props.specialFormEntries.filter(
    ({ form }) => form.variantKind === 'mega' || form.variantKind === 'primal'
  )
)

const dynamaxFormEntries = computed(() =>
  props.specialFormEntries.filter(({ form }) => form.variantKind === 'dynamax')
)

const emit = defineEmits<{
  selectMegaForm: [index: number | null]
}>()

function handleMegaToggle(index: number) {
  if (props.activeMegaFormIndex === index) {
    emit('selectMegaForm', null)
    return
  }

  emit('selectMegaForm', index)
}
</script>

<template>
  <div class="space-y-1 sm:space-y-3">
    <p class="text-xs sm:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/80">
      #{{ pokemon.id.toString().padStart(3, '0') }}
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-semibold leading-tight">
        {{ pokemon.name }}
      </h1>
      <div v-if="hasMegaEvolution && specialFormEntries.length" class="flex flex-wrap items-center gap-2">
        <div v-if="megaFormEntries.length" class="flex flex-wrap items-center gap-2">
          <PokemonGridMegaToggleButton
            v-for="entry in megaFormEntries"
            :key="entry.form.id"
            :is-visible="Boolean(entry.form.stone?.sprite)"
            :is-mega-active="activeMegaFormIndex === entry.index"
            :stone-sprite="entry.form.stone?.sprite ?? undefined"
            :display-name="entry.form.name"
            @toggle="() => handleMegaToggle(entry.index)"
          />
        </div>
        <div v-if="dynamaxFormEntries.length" class="flex flex-wrap items-center gap-2">
          <PokemonGridDynamaxToggleButton
            v-for="entry in dynamaxFormEntries"
            :key="entry.form.id"
            :is-visible="true"
            :is-active="activeMegaFormIndex === entry.index"
            :display-name="entry.form.name"
            @toggle="() => handleMegaToggle(entry.index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
