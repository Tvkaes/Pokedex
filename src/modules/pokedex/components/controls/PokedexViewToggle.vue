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
  <div class="flex rounded-full border border-white/30 bg-white/10 p-1 text-xs uppercase tracking-[0.3em] backdrop-blur">
    <button
      class="rounded-full px-4 py-2 transition"
      :class="active === 'hero' ? 'bg-white text-surface-900' : 'text-white/70'"
      type="button"
      @click="handleSelect('hero')"
    >
      Hero
    </button>
    <button
      class="rounded-full px-4 py-2 transition"
      :class="active === 'grid' ? 'bg-white text-surface-900' : 'text-white/70'"
      type="button"
      @click="handleSelect('grid')"
    >
      Grid
    </button>
  </div>
</template>
