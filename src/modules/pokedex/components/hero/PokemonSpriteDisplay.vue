<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'
import type { TypeColorConfig } from '@/utils/typeColors'

interface CanvasParticle {
  angle: number
  distance: number
  duration: number
  delay: number
  color: string
  size: number
  rotation: number
}

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

const burstContainerRef = ref<HTMLDivElement | null>(null)
const burstCanvasRef = ref<HTMLCanvasElement | null>(null)

let burstCtx: CanvasRenderingContext2D | null = null
let burstParticles: CanvasParticle[] = []
let burstAnimationFrame: number | null = null
let burstStartTime = 0
let resizeObserver: ResizeObserver | null = null
let motionMedia: MediaQueryList | null = null
let motionListener: ((event: MediaQueryListEvent) => void) | null = null

const reduceMotion = ref(false)
const burstColors = ['#fde047', '#fee2e2', '#f9a8d4', '#bae6fd', '#c4b5fd'] as const

watch(
  () => props.showShiny,
  (isShiny, prev) => {
    if (isShiny && !prev) {
      triggerStarBurst()
    }
  }
)

function setupMotionPreference() {
  if (typeof window === 'undefined') return
  motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = motionMedia.matches
  motionListener = (event) => {
    reduceMotion.value = event.matches
  }
  motionMedia.addEventListener('change', motionListener)
}

function randomBurstColor() {
  return burstColors[Math.floor(Math.random() * burstColors.length)] ?? '#fde047'
}

function syncCanvasSize() {
  if (typeof window === 'undefined') return
  const canvas = burstCanvasRef.value
  const container = burstContainerRef.value
  if (!canvas || !container) return
  const width = container.clientWidth
  const height = container.clientHeight
  const ratio = window.devicePixelRatio || 1
  if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
    canvas.width = width * ratio
    canvas.height = height * ratio
  }
  const context = canvas.getContext('2d')
  if (!context) return
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.scale(ratio, ratio)
  burstCtx = context
}

function stopBurstAnimation() {
  if (!burstAnimationFrame) return
  cancelAnimationFrame(burstAnimationFrame)
  burstAnimationFrame = null
}

function disposeCanvas() {
  stopBurstAnimation()
  burstCtx = null
  burstParticles = []
}

function createBurstParticles(): CanvasParticle[] {
  const count = reduceMotion.value ? 10 : 18
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + (Math.random() * 0.4 - 0.2)
    const distance = 140 + Math.random() * 180
    return {
      angle,
      distance,
      duration: 0.9 + Math.random() * 0.6,
      delay: Math.random() * 0.12,
      color: randomBurstColor(),
      size: 4.5 + Math.random() * 3.5,
      rotation: Math.random() * Math.PI * 2,
    }
  })
}

function drawStar(ctx: CanvasRenderingContext2D, outerRadius: number, innerRadius: number, points = 5) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (Math.PI * i) / points
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
  }
  ctx.closePath()
  ctx.fill()
}

function drawParticles(timestamp: number) {
  if (!burstCtx || !burstCanvasRef.value || !burstParticles.length) return
  if (!burstStartTime) {
    burstStartTime = timestamp
  }
  const elapsed = (timestamp - burstStartTime) / 1000
  const canvas = burstCanvasRef.value
  burstCtx.clearRect(0, 0, canvas.width, canvas.height)

  const container = burstContainerRef.value
  const width = container?.clientWidth ?? 0
  const height = container?.clientHeight ?? 0
  const centerX = width / 2
  const centerY = height / 2

  let hasActiveParticle = false

  burstParticles.forEach((particle) => {
    const localTime = elapsed - particle.delay
    if (localTime < 0) {
      hasActiveParticle = true
      return
    }
    const progress = Math.min(localTime / particle.duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const x = centerX + Math.cos(particle.angle) * particle.distance * eased
    const y = centerY + Math.sin(particle.angle) * particle.distance * eased
    const alpha = Math.max(0, 0.9 - progress)
    const size = particle.size * (1 - progress * 0.35)
    const inner = size * 0.45

    burstCtx!.save()
    burstCtx!.translate(x, y)
    burstCtx!.rotate(particle.rotation + progress * 1.2)
    burstCtx!.fillStyle = particle.color
    burstCtx!.globalAlpha = alpha
    burstCtx!.shadowColor = particle.color
    burstCtx!.shadowBlur = size * 2.4
    drawStar(burstCtx!, size, inner, 5)
    burstCtx!.restore()

    if (progress < 1) {
      hasActiveParticle = true
    }
  })

  if (hasActiveParticle) {
    burstAnimationFrame = requestAnimationFrame(drawParticles)
  } else {
    burstAnimationFrame = null
    burstCtx?.clearRect(0, 0, canvas.width, canvas.height)
  }
}

function triggerStarBurst() {
  if (reduceMotion.value) return
  syncCanvasSize()
  if (!burstCanvasRef.value) return
  if (!burstCtx) {
    syncCanvasSize()
  }
  if (!burstCtx) return
  stopBurstAnimation()
  burstParticles = createBurstParticles()
  burstStartTime = 0
  burstCtx.clearRect(0, 0, burstCanvasRef.value.width, burstCanvasRef.value.height)
  burstAnimationFrame = requestAnimationFrame(drawParticles)
}

onMounted(() => {
  setupMotionPreference()
  syncCanvasSize()
  if (typeof window !== 'undefined' && burstContainerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      syncCanvasSize()
    })
    resizeObserver.observe(burstContainerRef.value)
  }
})

onBeforeUnmount(() => {
  disposeCanvas()
  resizeObserver?.disconnect()
  resizeObserver = null
  if (motionMedia && motionListener) {
    motionMedia.removeEventListener('change', motionListener)
  }
})
</script>

<template>
  <div class="relative flex flex-col items-center justify-center">
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
.burst-canvas {
  width: min(52rem, 85vw);
  height: min(52rem, 85vw);
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>
