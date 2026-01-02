<template>
  <component :is="asElement" :class="panelClasses" v-bind="restAttrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
    tone?: 'light' | 'dark'
    interactive?: boolean
    glow?: boolean
  }>(),
  {
    as: 'div',
    padding: 'md',
    tone: 'light',
    interactive: false,
    glow: false,
  }
)

const attrs = useAttrs()

const asElement = computed(() => props.as)

const panelClasses = computed(() =>
  [
    'glass-panel',
    `glass-panel--${props.tone}`,
    `glass-panel--padding-${props.padding}`,
    props.interactive && 'glass-panel--interactive',
    props.glow && 'glass-panel--glow',
    attrs.class,
  ].filter(Boolean)
)

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<style scoped>
.glass-panel {
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  color: inherit;
  transition:
    transform 0.35s ease,
    border-color 0.3s ease,
    box-shadow 0.35s ease,
    background 0.35s ease;
}



.glass-panel--padding-none {
  padding: 0;
}

.glass-panel--padding-sm {
  padding: 0.75rem;
}

.glass-panel--padding-md {
  padding: 1.25rem;
}

.glass-panel--padding-lg {
  padding: 1.75rem;
}



.glass-panel--glow {
  box-shadow:
    0 25px 60px rgba(79, 70, 229, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
</style>
