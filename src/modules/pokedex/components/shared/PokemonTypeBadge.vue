<script setup lang="ts">
import { computed } from 'vue'
import { getTypeColor } from '@/utils/typeColors'

const props = defineProps<{
  label: string
}>()

const normalizedType = computed(() => props.label.toLowerCase())
const typeColor = computed(() => getTypeColor(normalizedType.value))

const badgeStyle = computed(() => {
  const color = typeColor.value.color
  const glow = typeColor.value.glow
  return {
    background: `linear-gradient(120deg, ${color} 0%, ${color}cc 60%, rgba(255,255,255,0.08) 100%)`,
    borderColor: `${color}66`,
    boxShadow: `0 8px 24px ${glow}`,
  }
})
</script>

<template>
  <span class="type-badge" :style="badgeStyle">
    {{ props.label.toUpperCase() }}
  </span>
</template>

<style scoped>
.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.type-badge:hover {
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .type-badge {
    font-size: 0.625rem;
    padding: 0.25rem 0.75rem;
  }
}
</style>
