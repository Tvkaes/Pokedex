<script setup lang="ts">
import { GenerationConfig } from '@/modules/pokedex/data/generations';



const props = defineProps<{
  generations: GenerationConfig[]
  activeId: string
  loading: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

function handleSelect(id: string) {
  if (props.loading) return
  emit('select', id)
}
</script>

<template>
  <div class="mt-20 px-6 sm:px-10">
    <div class="mx-auto max-w-5xl rounded-[40px] border border-white/20 bg-white/10 px-6 py-8 text-center backdrop-blur">
      <p class="text-xs uppercase tracking-[0.5em] text-white/60">Generations</p>
      <h2 class="mt-2 text-3xl font-semibold tracking-tight">Explore the Eras of the Pokédex</h2>
      <p class="mt-2 text-sm text-white/70">
        Pick a region to load its full roster and browse every species.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <template v-for="generation in generations" :key="generation.id">
          <button
            class="rounded-full border px-5 py-2 text-xs uppercase tracking-[0.35em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :class="
              generation.id === activeId
                ? 'border-white bg-white text-surface-900 shadow-lg shadow-white/30'
                : 'border-white/30 bg-white/5 text-white/70 hover:bg-white/10'
            "
            type="button"
            :disabled="loading"
            @click="handleSelect(generation.id)"
          >
            {{ generation.label }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
