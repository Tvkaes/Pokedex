<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    count?: number
  }>(),
  { count: 8 }
)

const placeholders = computed(() => Array.from({ length: props.count }, (_, index) => index))
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div
      v-for="placeholder in placeholders"
      :key="`skeleton-${placeholder}`"
      class="skeleton-card"
    >
      <div class="skeleton-header">
        <span class="skeleton-pill" />
        <span class="skeleton-chip" />
      </div>
      <div class="skeleton-media">
        <span class="skeleton-circle" />
      </div>
      <div class="skeleton-footer">
        <span class="skeleton-line w-1/3" />
        <span class="skeleton-line w-2/3" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  min-height: 320px;
  border-radius: 32px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
  position: relative;
}

.skeleton-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.15) 45%, transparent 90%);
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
}

.skeleton-header,
.skeleton-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.skeleton-pill,
.skeleton-chip,
.skeleton-line,
.skeleton-circle {
  display: inline-block;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 9999px;
  position: relative;
  overflow: hidden;
}

.skeleton-pill {
  width: 110px;
  height: 18px;
}

.skeleton-chip {
  width: 58px;
  height: 32px;
}

.skeleton-media {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-circle {
  width: 180px;
  height: 180px;
  border-radius: 9999px;
}

.skeleton-footer {
  flex-direction: column;
  align-items: flex-start;
}

.skeleton-line {
  height: 18px;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
