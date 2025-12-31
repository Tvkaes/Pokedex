<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'
import PokemonStatRadar from './PokemonStatRadar.vue'

const props = defineProps<{
  stats: PokemonDisplayData['stats']
  signatureMoves?: PokemonDisplayData['signatureMoves']
}>()

const signatureMoves = computed(() => props.signatureMoves ?? [])

function formatMethodLabel(method?: string | null) {
  if (!method) return null
  return method
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-5">
      <div class="flex flex-col gap-6 md:flex-row md:items-stretch">
        <div class="flex flex-col items-center gap-2 md:w-auto">
          <PokemonStatRadar :stats="stats" />
          <p class="text-[10px] uppercase tracking-[0.3em] text-white/40">Base stats scale</p>
        </div>
        <div class="flex-1 grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <div class="rounded-2xl border border-white/10 bg-white/5/5 p-3 sm:p-4 flex flex-col gap-3">
            <p class="text-[11px] uppercase tracking-[0.35em] text-white/60">Signature Moves</p>
            <ul class="space-y-2">
              <li
                v-for="move in signatureMoves"
                :key="move.name"
                class="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <p class="text-base font-semibold tracking-tight text-white">{{ move.name }}</p>
                  <p class="text-[10px] uppercase tracking-[0.35em] text-white/50">
                    <span v-if="move.level">Lvl {{ move.level }}</span>
                    <span v-if="move.method" class="ml-2">{{ formatMethodLabel(move.method) }}</span>
                  </p>
                </div>
                <span v-if="move.versionGroup" class="text-[10px] uppercase tracking-[0.35em] text-white/60">
                  {{ move.versionGroup }}
                </span>
              </li>
              <li v-if="!signatureMoves.length" class="text-[11px] uppercase tracking-[0.3em] text-white/40">
                No signature moves recorded.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
