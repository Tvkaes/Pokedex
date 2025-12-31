<script setup lang="ts">
import type { PokemonInfoSectionId } from '@pokedex/types/pokemon-info.types'

type SectionOption = {
  id: PokemonInfoSectionId
  label: string
  disabled?: boolean
}

const props = defineProps<{
  description: string
  sections: SectionOption[]
  activeSection: PokemonInfoSectionId
}>()

const emit = defineEmits<{
  select: [sectionId: PokemonInfoSectionId]
}>()

function handleSelect(sectionId: PokemonInfoSectionId, disabled?: boolean) {
  if (disabled) return
  emit('select', sectionId)
}
</script>

<template>
  <div class="rounded-3xl border border-white/10 bg-white/5/60 backdrop-blur-sm p-5 sm:p-6 shadow-lg shadow-black/10 transition">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="section in sections"
        :key="section.id"
        class="rounded-full px-4 py-1.5 text-xs tracking-[0.25em] uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        :class="
          section.id === activeSection
            ? 'bg-white text-surface-900 shadow shadow-white/40'
            : section.disabled
              ? 'bg-white/5 text-white/40 cursor-not-allowed'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
        "
        :disabled="section.disabled"
        @click="handleSelect(section.id, section.disabled)"
      >
        {{ section.label }}
      </button>
    </div>

    <div class="mt-6">
      <slot name="content" :active-section="activeSection" />
    </div>

  </div>
</template>
