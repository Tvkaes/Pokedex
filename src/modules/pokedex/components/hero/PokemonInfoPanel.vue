<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PokemonAlternateForm, PokemonDisplayData, PokemonFormEntry } from '@/types/pokemon.types'
import PokemonTypeBadge from '@pokedex/components/shared/PokemonTypeBadge.vue'
import PokemonInfoHeader from './PokemonInfoHeader.vue'
import PokemonInfoSummaryCard from './PokemonInfoSummaryCard.vue'
import PokemonInfoDetailPanel from './PokemonInfoDetailPanel.vue'
import type { PokemonInfoSectionId } from '@pokedex/types/pokemon-info.types'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  pokemon: PokemonDisplayData
  imperialHeight: string
  imperialWeight: string
  hasMegaEvolution: boolean
  megaForms: PokemonAlternateForm[]
  specialFormEntries: PokemonFormEntry[]
  regionalFormEntries: PokemonFormEntry[]
  activeMegaFormIndex: number | null
}>()

const emit = defineEmits<{
  selectMegaForm: [index: number | null]
}>()

function handleMegaSelect(index: number | null) {
  emit('selectMegaForm', index)
}

const { t } = useTranslation()

interface SectionOption {
  id: PokemonInfoSectionId
  label: string
  disabled?: boolean
}

const hasAlternateForms = computed(() => props.regionalFormEntries.length > 0)

const sectionOptions = computed<SectionOption[]>(() => {
  const sections: SectionOption[] = [
    { id: 'entry', label: t('section.entry') },
    { id: 'stats', label: t('section.stats') },
    { id: 'ability', label: t('section.ability') },
    { id: 'matchups', label: t('section.matchups') },
  ]

  const hasForms = hasAlternateForms.value
  sections.push({
    id: 'forms',
    label: t('section.forms'),
    disabled: !hasForms,
  })

  return sections
})

const activeSection = ref<PokemonInfoSectionId>('entry')

watch(
  () => props.pokemon.id,
  () => {
    activeSection.value = 'entry'
  }
)

function handleSectionSelect(sectionId: PokemonInfoSectionId) {
  const allowed: PokemonInfoSectionId[] = ['entry', 'stats', 'ability', 'forms', 'matchups']
  if (allowed.includes(sectionId)) {
    activeSection.value = sectionId
  }
}
</script>

<template>
  <div class="space-y-4 sm:space-y-6 text-left">
    <PokemonInfoHeader
      :pokemon="pokemon"
      :has-mega-evolution="hasMegaEvolution"
      :mega-forms="megaForms"
      :special-form-entries="specialFormEntries"
      :active-mega-form-index="activeMegaFormIndex"
      @select-mega-form="handleMegaSelect"
    />

    <div class="flex flex-wrap gap-2 sm:gap-3">
      <PokemonTypeBadge v-for="type in pokemon.types" :key="type.type.name" :label="type.type.name" />
    </div>
    <div class="space-y-1 type-metric text-white/80">
      <p>
        {{ t('height') }} ·
        <span class="font-mono tracking-normal">{{ imperialHeight }}</span>
      </p>
      <p>
        {{ t('weight') }} ·
        <span class="font-mono tracking-normal">{{ imperialWeight }}</span>
      </p>
    </div>

    <PokemonInfoSummaryCard
      :description="pokemon.description"
      :sections="sectionOptions"
      :active-section="activeSection"
      @select="handleSectionSelect"
    >
      <template #content="{ activeSection }">
        <PokemonInfoDetailPanel
          :pokemon="pokemon"
          :section="activeSection"
          :regional-form-entries="regionalFormEntries"
          :active-mega-form-index="activeMegaFormIndex"
          @select-form="handleMegaSelect"
        />
      </template>
    </PokemonInfoSummaryCard>
  </div>
</template>

<style scoped>
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.panel-toggle-enter-active,
.panel-toggle-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.panel-toggle-enter-from,
.panel-toggle-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
</style>
