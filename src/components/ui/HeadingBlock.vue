<template>
  <header :class="['heading-block', alignClass]">
    <p v-if="eyebrow" class="type-eyebrow heading-block__eyebrow">
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </p>
    <component :is="resolvedTag" class="heading-block__title" :class="titleSizeClass">
      <slot name="title">
        {{ title }}
      </slot>
    </component>
    <p v-if="subtitle" class="type-subtitle heading-block__subtitle">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    subtitle?: string
    align?: 'left' | 'center'
    size?: 'sm' | 'lg'
    as?: string
  }>(),
  {
    align: 'left',
    size: 'lg',
    as: 'h2',
  }
)

const resolvedTag = computed(() => props.as)

const alignClass = computed(() => (props.align === 'center' ? 'heading-block--center' : null))

const titleSizeClass = computed(() => (props.size === 'sm' ? 'type-title-sm' : 'type-title-lg'))
</script>

<style scoped>
.heading-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.heading-block--center {
  text-align: center;
  align-items: center;
}

.heading-block__title {
  font-family: var(--font-family-display);
  color: rgba(255, 255, 255, 0.95);
}

.heading-block__subtitle {
  max-width: 48rem;
}
</style>
