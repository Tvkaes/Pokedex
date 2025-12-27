<script setup lang="ts">
import type { ComponentPublicInstance, VNodeRef } from 'vue'

defineProps<{
  numbers: number[]
  currentId: number
  setContainerRef?: VNodeRef
  setButtonRef?: (el: Element | ComponentPublicInstance | null, number: number) => void
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

function handleSelect(id: number) {
  emit('select', id)
}
</script>

<template>
  <div
    :ref="setContainerRef"
    class="flex flex-col h-40 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide text-right"
  >
    <button
      v-for="number in numbers"
      :key="number"
      type="button"
      class="py-0.5 text-right transition-colors hover:text-white focus:outline-none"
      :class="[
        number === currentId
          ? 'text-white font-bold text-base xl:text-lg tracking-[0.4em]'
          : 'text-white/40 tracking-[0.35em]'
      ]"
      :aria-current="number === currentId ? 'true' : undefined"
      :ref="(el) => setButtonRef?.(el, number)"
      @click="handleSelect(number)"
    >
      {{ number.toString().padStart(3, '0') }}
    </button>
  </div>
</template>
