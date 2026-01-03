<script setup lang="ts">
import { toRef } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'
import type { TypeColorConfig } from '@/utils/typeColors'
import { useShinyBurstCanvas } from '@/composables/useShinyBurstCanvas'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const props = defineProps<{
  pokemon: PokemonDisplayData
  typeColor: TypeColorConfig
  displaySprite: string
  showShiny: boolean
  hasShiny: boolean
  spriteAnimationKey: number
  auraMotion: Record<string, unknown>
  spriteMotion: Record<string, unknown>
}>()

const emit = defineEmits<{
  toggleShiny: []
}>()

const { spriteSectionRef, burstContainerRef, burstCanvasRef } = useShinyBurstCanvas({
  showShiny: toRef(props, 'showShiny'),
})

defineExpose({
  spriteSectionRef,
  burstContainerRef,
  burstCanvasRef,
})
</script>

<template>
  <div ref="spriteSectionRef" class="relative flex flex-col items-center justify-center">
    <div
      :key="`${pokemon.id}-aura-${spriteAnimationKey}`"
      class="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 blur-[100px] opacity-50 rounded-full"
      :style="{ backgroundColor: typeColor.glow }"
      v-motion="auraMotion"
    />
    <div
      ref="burstContainerRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
    >
      <canvas ref="burstCanvasRef" class="burst-canvas" />
    </div>
    <div
      :key="`${pokemon.id}-sprite-${spriteAnimationKey}`"
      v-motion="spriteMotion"
      class="relative z-10"
    >
      <img
        :src="displaySprite"
        :alt="showShiny ? `${pokemon.name} shiny` : pokemon.name"
        loading="eager"
        fetchpriority="high"
        class="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-105"
      />
    </div>
    <div class="flex flex-col items-center gap-3 mt-4 lg:mt-6">
      <div class="text-center text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80">
        {{ t('bio') }} · {{ pokemon.genus || 'Pokémon' }}
      </div>
      <button
        v-if="hasShiny"
        type="button"
        class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        :aria-pressed="showShiny"
        :title="showShiny ? t('shiny.tooltipBase') : t('shiny.tooltipShiny')"
        @click="emit('toggleShiny')"
      >
        <span>{{ showShiny ? t('shinyForm') : t('baseForm') }}</span>
        <span
          class="relative inline-flex h-5 w-10 items-center rounded-full transition duration-300"
          :class="showShiny ? 'bg-white' : 'bg-white/30'"
        >
          <span
            class="inline-block h-4 w-4 rounded-full transition duration-300 bg-surface-900"
            :class="showShiny ? 'translate-x-5' : 'translate-x-1 bg-white'"
          />
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.burst-canvas {
  width: min(52rem, 85vw);
  height: min(52rem, 85vw);
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>
