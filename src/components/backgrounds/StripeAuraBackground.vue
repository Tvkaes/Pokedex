<script setup lang="ts">
import { toRef } from 'vue'
import { useStripeAuraScene } from '@/composables/useStripeAuraScene'

const props = defineProps<{
  primaryColor: string
  secondaryColor?: string | null
}>()

const auraScene = useStripeAuraScene({
  primary: toRef(props, 'primaryColor'),
  secondary: toRef(props, 'secondaryColor'),
})

const { containerRef, canvasRef } = auraScene
</script>

<template>
  <div ref="containerRef" class="stripe-hero-bg">
    <canvas ref="canvasRef" class="h-full w-full"></canvas>
    <div class="stripe-hero-bg__overlay" />
  </div>
</template>

<style scoped>
.stripe-hero-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  z-index: 0;
}

.stripe-hero-bg__overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.2), rgba(2, 6, 23, 0.75));
  mix-blend-mode: screen;
  opacity: 0.8;
}
</style>
