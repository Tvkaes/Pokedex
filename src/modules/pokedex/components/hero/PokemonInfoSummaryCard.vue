<script setup lang="ts">
import { computed } from 'vue'
import GlassPanel from '@/components/ui/GlassPanel.vue'
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

const buttonClasses = computed(() => ({
  base: 'rounded-full px-4 py-1.5 text-xs tracking-[0.25em] uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
  active: 'bg-white text-surface-900 shadow shadow-white/40',
  disabled: 'bg-white/5 text-white/40 cursor-not-allowed',
  idle: 'bg-white/10 text-white/80 hover:bg-white/20',
}))

function resolveButtonClass(section: SectionOption) {
  const classes = [buttonClasses.value.base]
  if (section.id === props.activeSection) {
    classes.push(buttonClasses.value.active)
  } else if (section.disabled) {
    classes.push(buttonClasses.value.disabled)
  } else {
    classes.push(buttonClasses.value.idle)
  }
  return classes.join(' ')
}

function handleSelect(sectionId: PokemonInfoSectionId, disabled?: boolean) {
  if (disabled) return
  emit('select', sectionId)
}
</script>

<template>
  <GlassPanel padding="lg" class="space-y-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="section in sections"
        :key="section.id"
        :class="resolveButtonClass(section)"
        :disabled="section.disabled"
        @click="handleSelect(section.id, section.disabled)"
      >
        {{ section.label }}
      </button>
    </div>

    <div>
      <slot name="content" :active-section="activeSection" />
    </div>
  </GlassPanel>
</template>
