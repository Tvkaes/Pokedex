<script setup lang="ts">
import PokemonGridMegaToggleButton from '@pokedex/components/grid/PokemonGridMegaToggleButton.vue'
import type { PokemonAlternateForm, PokemonDisplayData } from '@/types/pokemon.types'

const props = defineProps<{
  pokemon: PokemonDisplayData
  hasMegaEvolution: boolean
  megaForms: PokemonAlternateForm[]
  activeMegaFormIndex: number | null
}>()

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
      <div v-if="hasMegaEvolution && megaForms.length" class="flex flex-wrap items-center gap-2">
        <PokemonGridMegaToggleButton
          v-for="(form, index) in megaForms"
          :key="form.id"
          :is-visible="Boolean(form.stone?.sprite)"
          :is-mega-active="activeMegaFormIndex === index"
          :stone-sprite="form.stone?.sprite ?? undefined"
          :display-name="form.name"
          @toggle="() => handleMegaToggle(index)"
        />
      </div>
    </div>
  </div>
</template>
