<script setup lang="ts">
const props = withDefaults(defineProps<{
  glow?: boolean
}>(), {
  glow: false,
})
</script>

<template>
  <div
    class="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 transition-all duration-300"
    :class="props.glow ? 'shadow-glow hover:shadow-xl hover:-translate-y-1' : 'hover:border-white/20'"
  >
    <slot />
  </div>
</template>
