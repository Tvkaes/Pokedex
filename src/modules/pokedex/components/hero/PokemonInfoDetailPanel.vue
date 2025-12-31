<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonAlternateForm, PokemonDisplayData } from '@/types/pokemon.types'
import type { PokemonInfoSectionId } from '@pokedex/types/pokemon-info.types'
import PokemonEntryDetails from './PokemonEntryDetails.vue'
import PokemonStatsPanel from './PokemonStatsPanel.vue'
import PokemonAbilityCard from './PokemonAbilityCard.vue'
import PokemonFormsList from './PokemonFormsList.vue'

type FormEntry = {
  form: PokemonAlternateForm
  index: number
  secondaryType: string | null
}

const props = defineProps<{
  pokemon: PokemonDisplayData
  section: PokemonInfoSectionId
  regionalFormEntries: FormEntry[]
  activeMegaFormIndex: number | null
}>()

const emit = defineEmits<{
  selectForm: [index: number | null]
}>()

const isBaseActive = computed(() => props.activeMegaFormIndex === null)
const formEntries = computed(() => props.regionalFormEntries)
const hasForms = computed(() => formEntries.value.length > 0)
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
    <PokemonEntryDetails v-if="section === 'entry'" :pokemon="pokemon" />

    <PokemonStatsPanel
      v-else-if="section === 'stats'"
      :pokemon-id="pokemon.id"
      :stats="pokemon.stats"
      :competitive-sets="pokemon.competitiveSets"
    />

    <PokemonAbilityCard v-else-if="section === 'ability'" :pokemon="pokemon" />

    <PokemonFormsList
      v-else-if="section === 'forms'"
      :has-forms="hasForms"
      :is-base-active="isBaseActive"
      :visible-form-entries="visibleFormEntries"
      @select="handleFormSelect"
    />
  </div>
</template>

