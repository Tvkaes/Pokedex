<script setup lang="ts">
const props = defineProps<{
  active: 'hero' | 'grid'
}>()

const emit = defineEmits<{
  switch: ['hero' | 'grid']
}>()

function handleSelect(mode: 'hero' | 'grid') {
  if (mode === props.active) return
  emit('switch', mode)
}
</script>

<template>
  <div class="view-toggle">
    <button
      class="view-toggle__button"
      :class="[{ 'view-toggle__button--active': active === 'hero' }]"
      type="button"
      aria-label="Single view"
      @click="handleSelect('hero')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3.5c-3.6 0-6.5 2.9-6.5 6.5S8.4 16.5 12 16.5s6.5-2.9 6.5-6.5S15.6 3.5 12 3.5Z"
        />
        <path
          d="M6 20.5c1.5-2.6 4.1-4.2 6-4.2s4.5 1.6 6 4.2"
          stroke-width="1.4"
          stroke-linecap="round"
        />
      </svg>
     
    </button>
    <button
      class="view-toggle__button"
      :class="[{ 'view-toggle__button--active': active === 'grid' }]"
      type="button"
      aria-label="Grid view"
      @click="handleSelect('grid')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </svg>
     
    </button>
  </div>
</template>

<style scoped>
.view-toggle {
  display: inline-flex;
  gap: 0.35rem;
  padding: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(2, 6, 23, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.view-toggle__button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: color 0.2s ease, background 0.2s ease;
}

.view-toggle__button svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  fill: none;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.view-toggle__button--active {
  background: white;
  color: #020617;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.35);
}

.view-toggle__button--active svg {
  stroke: #020617;
  fill: none;
}
</style>
