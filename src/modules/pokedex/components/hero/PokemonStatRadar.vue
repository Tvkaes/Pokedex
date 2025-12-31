<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'

const props = defineProps<{
  stats: PokemonDisplayData['stats']
}>()

const SVG_SIZE = 180
const CENTER = SVG_SIZE / 2
const RADIUS = 65
const GRID_LEVELS = [0.4, 0.7, 1]

function polarPoint(percentage: number, index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const distance = (percentage / 100) * RADIUS
  return {
    x: CENTER + Math.cos(angle) * distance,
    y: CENTER + Math.sin(angle) * distance,
  }
}

function labelPoint(index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const distance = RADIUS + 26
  return {
    x: CENTER + Math.cos(angle) * distance,
    y: CENTER + Math.sin(angle) * distance,
  }
}

const polygonPoints = computed(() => {
  const total = props.stats.length || 1
  return props.stats
    .map((stat, index) => {
      const { x, y } = polarPoint(stat.percentage, index, total)
      return `${x},${y}`
    })
    .join(' ')
})

const gridPolygons = computed(() => {
  const total = props.stats.length || 1
  return GRID_LEVELS.map((level) =>
    props.stats
      .map((_, index) => {
        const { x, y } = polarPoint(level * 100, index, total)
        return `${x},${y}`
      })
      .join(' ')
  )
})

const axisLines = computed(() => {
  const total = props.stats.length || 1
  return props.stats.map((_, index) => {
    const { x, y } = polarPoint(100, index, total)
    return { x, y }
  })
})

const labelPositions = computed(() => {
  const total = props.stats.length || 1
  return props.stats.map((stat, index) => {
    const { x, y } = labelPoint(index, total)
    return {
      label: stat.label,
      value: stat.value,
      style: {
        left: `${x}px`,
        top: `${y}px`,
      },
      alignment: y < CENTER ? 'text-top' : y > CENTER ? 'text-bottom' : 'text-middle',
    }
  })
})
</script>

<template>
  <div class="stat-radar">
    <svg :viewBox="`0 0 ${SVG_SIZE} ${SVG_SIZE}`" class="stat-radar__svg" role="img" aria-label="Stat radar chart">
      <defs>
        <linearGradient id="statRadarFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.65)" />
          <stop offset="100%" stop-color="rgba(59,130,246,0.45)" />
        </linearGradient>
      </defs>
      <g class="stat-radar__grid">
        <polygon
          v-for="(points, index) in gridPolygons"
          :key="`grid-${index}`"
          :points="points"
          :class="['stat-radar__grid-ring', { 'stat-radar__grid-ring--outer': index === gridPolygons.length - 1 }]"
        />
        <line
          v-for="(axis, index) in axisLines"
          :key="`axis-${index}`"
          :x1="CENTER"
          :y1="CENTER"
          :x2="axis.x"
          :y2="axis.y"
          class="stat-radar__axis-line"
        />
      </g>
      <polygon :points="polygonPoints" class="stat-radar__shape" />
      <circle :cx="CENTER" :cy="CENTER" r="3" class="stat-radar__center" />
    </svg>
    <div class="stat-radar__labels">
      <div
        v-for="entry in labelPositions"
        :key="entry.label"
        :class="['stat-radar__label', `stat-radar__label--${entry.alignment}`]"
        :style="entry.style"
      >
        <span class="stat-radar__label-text">{{ entry.label }}</span>
        <span class="stat-radar__label-value">{{ entry.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-radar {
  position: relative;
  width: 180px;
  max-width: 100%;
  margin-inline: auto;
}

.stat-radar__svg {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 10px 30px rgba(15, 23, 42, 0.35));
}

.stat-radar__grid-ring {
  fill: rgba(255, 255, 255, 0.04);
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 1;
}

.stat-radar__grid-ring--outer {
  stroke: rgba(255, 255, 255, 0.35);
}

.stat-radar__axis-line {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 1;
}

.stat-radar__shape {
  fill: url(#statRadarFill);
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 1.5;
  mix-blend-mode: screen;
}

.stat-radar__center {
  fill: rgba(255, 255, 255, 0.9);
}

.stat-radar__labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.stat-radar__label {
  position: absolute;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-family: 'Space Grotesk', 'DM Sans', sans-serif;
}

.stat-radar__label-value {
  display: block;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  color: #fff;
}

.stat-radar__label--text-top .stat-radar__label-text {
  display: block;
  margin-bottom: 0.15rem;
}

.stat-radar__label--text-bottom .stat-radar__label-text {
  display: block;
  margin-top: 0.15rem;
}
</style>
