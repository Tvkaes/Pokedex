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
  <nav
    :ref="setContainerRef"
    class="border-t border-white/20 px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] overflow-x-auto scrollbar-hide"
  >
    <div class="flex gap-3 sm:gap-4 min-w-max">
      <button
        v-for="number in numbers"
        :key="number"
        type="button"
        class="transition-colors hover:text-white focus:outline-none"
        :class="number === currentId ? 'text-white font-bold' : 'text-white/50'"
        :aria-current="number === currentId ? 'true' : undefined"
        :ref="(el) => setButtonRef?.(el, number)"
        @click="handleSelect(number)"
      >
        {{ number.toString().padStart(3, '0') }}
      </button>
    </div>
  </nav>
</template>
