<script setup lang="ts">
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="scroll-top-btn"
    :class="{ 'scroll-top-btn--visible': props.visible }"
    type="button"
    aria-label="Volver al inicio"
    @click="emit('click')"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14" stroke-width="1.6" stroke-linecap="round" />
      <path d="M6 11l6-6 6 6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<style scoped>
.scroll-top-btn {
  position: fixed;
  right: 2rem;
  bottom: 2.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(2, 6, 23, 0.15);
  color: white;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 40;
}

.scroll-top-btn svg {
  width: 1.3rem;
  height: 1.3rem;
  stroke: currentColor;
  fill: none;
}

.scroll-top-btn--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
</style>
