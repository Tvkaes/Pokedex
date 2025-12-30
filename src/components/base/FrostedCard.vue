<template>
  <component :is="asElement" :class="classes" v-bind="restProps">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    as?: string
  }>(),
  { as: 'div' }
)

const attrs = useAttrs()

const asElement = computed(() => props.as)

const classes = computed(() => ['frosted-card', attrs.class].filter(Boolean))

const restProps = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<style scoped>
.frosted-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 25px 50px rgba(2, 6, 23, 0.45);
}
</style>
