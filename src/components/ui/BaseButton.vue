<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
})
</script>

<template>
  <button
    class="btn rounded-2xl font-semibold tracking-wide transition-all duration-300"
    :class="[
      props.variant === 'primary' && 'btn-primary text-white shadow-glow hover:shadow-xl',
      props.variant === 'secondary' && 'bg-white/10 text-white border-white/20 hover:bg-white/20',
      props.variant === 'ghost' && 'btn-ghost text-white/80',
      props.size === 'lg' && 'btn-lg px-8',
      props.size === 'md' && 'btn-md px-6',
      props.size === 'sm' && 'btn-sm px-4',
      props.loading && 'btn-disabled'
    ]"
    :disabled="props.loading"
  >
    <span v-if="props.loading" class="loading loading-spinner loading-sm"></span>
    <slot />
  </button>
</template>
