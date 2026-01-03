<script setup lang="ts">
import PokemonFormVariantCard from './PokemonFormVariantCard.vue'
import type { PokemonFormEntry } from '@/types/pokemon.types'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  hasForms: boolean
  isBaseActive: boolean
  visibleFormEntries: PokemonFormEntry[]
}>()

const emit = defineEmits<{
  select: [index: number | null]
}>()

const { t } = useTranslation()

function handleSelect(index: number | null) {
  emit('select', index)
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="hasForms" class="space-y-3">
      <Transition name="fade" mode="out-in">
        <div class="space-y-3">
          <div v-if="!isBaseActive" class="space-y-2">
            <button
              type="button"
              class="w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 type-pill text-white/90 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              @click="handleSelect(null)"
            >
              {{ t('forms.backToBase') }}
            </button>
            <p class="type-caption text-white/50">{{ t('forms.otherForms') }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <PokemonFormVariantCard
              v-for="entry in visibleFormEntries"
              :key="entry.form.id"
              :title="entry.form.name"
              :variant-kind="entry.form.variantKind"
              :region="entry.form.region"
              :primary-type="entry.form.primaryType"
              :secondary-type="entry.secondaryType"
              :hint="t('forms.hintPreview')"
              @select="() => handleSelect(entry.index)"
            />
          </div>
        </div>
      </Transition>
    </div>
    <p v-else class="text-sm text-white/60">{{ t('forms.none') }}</p>
  </div>
</template>
