<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'
import type { TypeColorConfig } from '@/utils/typeColors'

interface StarParticle {
  id: string
  x: number
  y: number
  delay: number
  scale: number
  color: string
}

const props = defineProps<{
  pokemon: PokemonDisplayData
  typeColor: TypeColorConfig
  displaySprite: string
  showShiny: boolean
  hasShiny: boolean
  auraMotion: Record<string, unknown>
  spriteMotion: Record<string, unknown>
}>()

const emit = defineEmits<{
  toggleShiny: []
}>()

const shinyStars = ref<StarParticle[]>([])
let clearStarsTimeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.showShiny,
  (isShiny, prev) => {
    if (isShiny && !prev) {
      triggerStarBurst()
    }
  }
)

function triggerStarBurst() {
  if (clearStarsTimeout) {
    clearTimeout(clearStarsTimeout)
    clearStarsTimeout = null
  }

  const starCount = 24
  const newStars: StarParticle[] = Array.from({ length: starCount }, (_, index) => {
    const distance = 190 + Math.random() * 220
    const angle = (index / starCount) * Math.PI * 2 + Math.random() * 0.4
    return {
      id: `${props.pokemon.id}-star-${Date.now()}-${index}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: Math.random() * 0.12,
      scale: 0.6 + Math.random() * 0.7,
      color: Math.random() > 0.5 ? '#fde047' : '#38bdf8',
    }
  })

  shinyStars.value = newStars
  clearStarsTimeout = setTimeout(() => {
    shinyStars.value = []
    clearStarsTimeout = null
  }, 1000)
}

function starStyle(star: StarParticle) {
  return {
    '--x': `${star.x}px`,
    '--y': `${star.y}px`,
    '--delay': `${star.delay}s`,
    '--scale': star.scale.toString(),
    background: `radial-gradient(circle at 50% 50%, ${star.color}, transparent 70%)`,
  }
}

onBeforeUnmount(() => {
  if (clearStarsTimeout) {
    clearTimeout(clearStarsTimeout)
    clearStarsTimeout = null
  }
})
</script>

<template>
  <div class="relative flex flex-col items-center justify-center">
    <div
      :key="`${pokemon.id}-aura`"
      class="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 blur-[100px] opacity-50 rounded-full"
      :style="{ backgroundColor: typeColor.glow }"
      v-motion="auraMotion"
    />
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 mix-blend-screen">
      <div class="relative w-[42rem] h-[42rem] sm:w-[52rem] sm:h-[52rem]">
        <span
          v-for="star in shinyStars"
          :key="star.id"
          class="burst-star"
          :style="starStyle(star)"
        />
      </div>
    </div>
    <div
      :key="`${pokemon.id}-sprite`"
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
        Bio · {{ pokemon.genus || 'Pokémon' }}
      </div>
      <button
        v-if="hasShiny"
        type="button"
        class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        :aria-pressed="showShiny"
        :title="showShiny ? 'Ver sprite normal' : 'Ver sprite shiny'"
        @click="emit('toggleShiny')"
      >
        <span>{{ showShiny ? 'Shiny Form' : 'Base Form' }}</span>
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
.burst-star {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34px;
  height: 34px;
  transform: translate(-50%, -50%);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  opacity: 0;
  animation: starBurst 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay);
  filter: drop-shadow(0 0 16px rgba(248, 250, 252, 0.9));
}

@keyframes starBurst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  35% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(calc(var(--scale, 1) * 1.75)) rotate(16deg);
  }
  70% {
    opacity: 0.55;
    transform: translate(calc(-50% + var(--x) * 0.65), calc(-50% + var(--y) * 0.65)) scale(calc(var(--scale, 1) * 0.85));
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0);
  }
}
</style>
