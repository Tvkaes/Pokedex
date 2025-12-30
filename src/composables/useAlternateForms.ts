import { computed, ref, type ComputedRef } from 'vue'
import type { PokemonAlternateForm } from '@/types/pokemon.types'

interface UseAlternateFormsOptions {
  forms: ComputedRef<PokemonAlternateForm[]>
}

export function useAlternateForms({ forms }: UseAlternateFormsOptions) {
  const activeFormIndex = ref<number | null>(null)

  const hasAlternateForms = computed(() => forms.value.length > 0)

  const activeForm = computed(() => {
    if (activeFormIndex.value === null) return null
    return forms.value[activeFormIndex.value] ?? null
  })

  function selectForm(index: number | null) {
    if (index === null) {
      activeFormIndex.value = null
      return
    }
    if (!forms.value[index]) return
    activeFormIndex.value = index
  }

  function toggleForm(index: number) {
    if (activeFormIndex.value === index) {
      activeFormIndex.value = null
      return
    }
    selectForm(index)
  }

  function resetForms() {
    activeFormIndex.value = null
  }

  return {
    alternateForms: forms,
    hasAlternateForms,
    activeForm,
    activeFormIndex,
    selectForm,
    toggleForm,
    resetForms,
  }
}
