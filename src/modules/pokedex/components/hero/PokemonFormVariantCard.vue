<script setup lang="ts">
const props = defineProps<{
  title: string
  variantKind?: string | null
  region?: string | null
  primaryType: string
  secondaryType?: string | null
  isBase?: boolean
  hint?: string
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="group flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-left transition hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    @click="emit('select')"
  >
    <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-white/50">
      <span>{{ isBase ? 'BASE' : variantKind || 'FORM' }}</span>
      <span v-if="region">{{ region }}</span>
    </div>
    <p class="text-base font-semibold text-white group-hover:text-white">
      {{ title }}
    </p>
    <div class="text-[11px] text-white/65 space-y-0.5">
      <p>
        Tipo principal:
        <span class="font-mono uppercase text-white">{{ primaryType }}</span>
      </p>
      <p v-if="secondaryType">
        Tipo secundario:
        <span class="font-mono uppercase text-white">{{ secondaryType }}</span>
      </p>
      <p v-if="hint" class="text-[10px] uppercase tracking-[0.3em] text-white/40">
        {{ hint }}
      </p>
    </div>
  </button>
</template>

