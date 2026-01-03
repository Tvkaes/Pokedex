<script setup lang="ts">
import type { PokemonDisplayData } from '@/types/pokemon.types'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  pokemon: PokemonDisplayData
}>()

const { t } = useTranslation()
</script>

<template>
  <div class="space-y-2 text-white/80">
    <p class="type-subtitle text-white/90">
      {{ pokemon.description }}
    </p>
    <p class="type-caption text-white/60">
      {{ t('entry.aliasPrefix') }} {{ pokemon.name }} {{ t('entry.aliasSuffix') }}
    </p>
  </div>
</template>
