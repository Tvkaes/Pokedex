<script setup lang="ts">
import { computed } from 'vue'
import FormVariantToggle from '@/components/ui/FormVariantToggle.vue'
import type { PokemonDisplayData, PokemonAlternateForm, PokemonFormEntry } from '@/types/pokemon.types'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  pokemon: PokemonDisplayData
  hasMegaEvolution: boolean
  megaForms: PokemonAlternateForm[]
  activeMegaFormIndex: number | null
  specialFormEntries: PokemonFormEntry[]
}>()

const { t } = useTranslation()

const megaFormEntries = computed(() =>
  props.megaForms.map((form, index) => ({
    form,
    index,
  }))
)

const dynamaxFormEntries = computed(() =>
  megaFormEntries.value.filter(({ form }) => form.variantKind === 'dynamax')
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
    <p class="type-pill text-white/70">
      #{{ pokemon.id.toString().padStart(3, '0') }}
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <h1 class="type-title-lg font-display leading-tight text-white">
        {{ pokemon.name }}
      </h1>
      <div v-if="hasMegaEvolution && megaFormEntries.length" class="flex flex-wrap items-center gap-2">
        <div v-if="megaFormEntries.length" class="flex flex-wrap items-center gap-2">
          <FormVariantToggle
            v-for="entry in megaFormEntries"
            :key="entry.form.id"
            :visible="Boolean(entry.form.stone?.sprite)"
            :variant="entry.form.variantKind === 'primal' ? 'primal' : 'mega'"
            :label="entry.form.name"
            :icon="entry.form.stone?.sprite ?? null"
            :active="activeMegaFormIndex === entry.index"
            @toggle="() => handleMegaToggle(entry.index)"
          >
            <template #sr>
              {{
                activeMegaFormIndex === entry.index
                  ? `${t('sr.returnBaseForm')} ${entry.form.name}`
                  : `${t('sr.activateForm')} ${entry.form.name}`
              }}
            </template>
          </FormVariantToggle>
        </div>
        <div v-if="dynamaxFormEntries.length" class="flex flex-wrap items-center gap-2">
          <FormVariantToggle
            v-for="entry in dynamaxFormEntries"
            :key="entry.form.id"
            variant="dynamax"
            :label="entry.form.name"
            :active="activeMegaFormIndex === entry.index"
            @toggle="() => handleMegaToggle(entry.index)"
          >
            <template #sr>
              {{
                activeMegaFormIndex === entry.index
                  ? `${t('sr.returnFromDynamax')} ${entry.form.name}`
                  : `${t('sr.activateDynamax')} ${entry.form.name}`
              }}
            </template>
          </FormVariantToggle>
        </div>
      </div>
    </div>
  </div>
</template>
