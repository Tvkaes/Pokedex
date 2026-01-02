<script setup lang="ts">
import { computed } from 'vue'
import LocaleToggle from '@/components/ui/LocaleToggle.vue'

const props = defineProps<{
  active: 'hero' | 'grid' | 'search'
}>()

const emit = defineEmits<{
  switch: ['hero' | 'grid' | 'search']
}>()

const modes: Array<'hero' | 'grid' | 'search'> = ['hero', 'grid', 'search']
const activeIndex = computed(() => {
  const index = modes.indexOf(props.active)
  return index >= 0 ? index : 0
})

const pillStyle = computed(() => ({
  transform: `translateX(${activeIndex.value * 100}%)`,
}))

function handleSelect(mode: 'hero' | 'grid' | 'search') {
  if (mode === props.active) return
  emit('switch', mode)
}
</script>

<template>
  <div class="view-toggle">
    <span class="view-toggle__pill" :style="pillStyle" aria-hidden="true" />
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
    <button class="view-toggle__button" :class="[{ 'view-toggle__button--active': active === 'search' }]" type="button" aria-label="Search view" @click="handleSelect('search')">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <line x1="16" y1="16" x2="21" y2="21" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <LocaleToggle />
  </div>
</template>

<style scoped>
.view-toggle {
  display: inline-flex;
  gap: 0;
  padding: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(2, 6, 23, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: relative;
  overflow: visible;
}

.view-toggle__pill {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  bottom: 0.4rem;
  width: calc((100% - 0.8rem) / 4);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 0;
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
  position: relative;
  z-index: 1;
  flex: 1 1 0%;
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
  color: #020617;
}

.view-toggle__button--active svg {
  stroke: #020617;
  fill: none;
}
</style>
