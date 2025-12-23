<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'
import { MAX_POKEMON_ID } from '@/utils/constants'
import { getTypeColor } from '@/utils/typeColors'

const props = defineProps<{
  pokemon: PokemonDisplayData
  primaryType: string
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

const typeColor = computed(() => getTypeColor(props.primaryType))

const backgroundLabel = computed(() => props.pokemon.nativeName ?? props.pokemon.name.toUpperCase())

const imperialHeight = computed(() => {
  const meters = props.pokemon.height
  const totalInches = meters * 39.3701
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return `${feet}' ${inches}"`
})

const imperialWeight = computed(() => {
  const kg = props.pokemon.weight
  const lbs = kg * 2.20462
  return `${Math.round(lbs)} lbs`
})

const baseNavigation = computed(() => {
  const start = 1
  const end = MAX_POKEMON_ID
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

const navContainer = ref<HTMLElement | null>(null)
const verticalNavContainer = ref<HTMLElement | null>(null)
const navButtonRefs = new Map<number, HTMLElement>()
const verticalButtonRefs = new Map<number, HTMLElement>()
const cryAudio = ref<HTMLAudioElement | null>(null)

function setNavButtonRef(el: Element | ComponentPublicInstance | null, number: number) {
  if (el instanceof HTMLElement) {
    navButtonRefs.set(number, el)
    return
  }

  navButtonRefs.delete(number)
}

function setVerticalButtonRef(el: Element | ComponentPublicInstance | null, number: number) {
  if (el instanceof HTMLElement) {
    verticalButtonRefs.set(number, el)
    return
  }

  verticalButtonRefs.delete(number)
}

async function scrollSelectedIntoView(id: number) {
  await nextTick()

  const container = navContainer.value
  const button = navButtonRefs.get(id) ?? null

  if (!container || !button || typeof window === 'undefined') return

  const paddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft || '0')
  const targetScroll = Math.max(0, button.offsetLeft - paddingLeft)

  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth',
  })
}

async function scrollVerticalSelectedIntoView(id: number) {
  await nextTick()

  const container = verticalNavContainer.value
  const button = verticalButtonRefs.get(id) ?? null

  if (!container || !button || typeof window === 'undefined') return

  const paddingTop = parseFloat(window.getComputedStyle(container).paddingTop || '0')
  const targetScroll = Math.max(0, button.offsetTop - paddingTop)

  container.scrollTo({
    top: targetScroll,
    behavior: 'smooth',
  })
}

async function playCry(url?: string) {
  if (!url || typeof Audio === 'undefined') return

  cryAudio.value?.pause()

  const audio = new Audio(url)
  audio.currentTime = 0
  cryAudio.value = audio

  try {
    await audio.play()
  } catch (error) {
    console.warn('No se pudo reproducir el cry del Pokémon.', error)
  }
}

watch(
  () => props.pokemon.id,
  (newId) => {
    scrollSelectedIntoView(newId)
    scrollVerticalSelectedIntoView(newId)
    void playCry(props.pokemon.cryUrl)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  cryAudio.value?.pause()
  cryAudio.value = null
})
</script>

<template>
  <div
    class="relative min-h-screen w-full text-surface-50 flex flex-col"
    :style="{ backgroundColor: typeColor.color || '#B3272C' }"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] text-[25vw] md:text-[18vw] font-black tracking-tight leading-none whitespace-nowrap">
        {{ backgroundLabel }}
      </span>
    </div>

    <div class="relative flex-1 grid gap-6 lg:gap-12 lg:grid-cols-[1.2fr_1fr_0.35fr] p-6 sm:p-8 lg:p-12 xl:p-16 items-center">
      <div class="space-y-4 sm:space-y-6 text-left order-last lg:order-first">
        <div class="space-y-1 sm:space-y-2">
          <p class="text-xs sm:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/80">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-semibold leading-tight">{{ pokemon.name }}</h1>
        </div>

        <div class="space-y-1 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/90">
          <p>Height · <span class="font-mono tracking-normal">{{ imperialHeight }}</span></p>
          <p>Weight · <span class="font-mono tracking-normal">{{ imperialWeight }}</span></p>
        </div>

        <p class="text-sm sm:text-base max-w-md leading-relaxed text-white/90 line-clamp-4">
          {{ pokemon.description || 'Descripción no disponible aún. Explora otra especie.' }}
        </p>

        <div class="flex flex-wrap gap-2 sm:gap-3">
          <span
            v-for="type in pokemon.types"
            :key="type.type.name"
            class="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/30 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs font-medium"
          >
            {{ type.type.name }}
          </span>
        </div>
      </div>

      <div class="relative flex flex-col items-center justify-center order-first lg:order-none">
        <div class="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 blur-[100px] opacity-50 rounded-full" :style="{ backgroundColor: typeColor.glow }" />
        <img
          :src="pokemon.sprite"
          :alt="pokemon.name"
          loading="eager"
          fetchpriority="high"
          class="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-105"
        />
        <div class="mt-4 lg:mt-6 text-center text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80">
          Bio · {{ pokemon.genus || 'Pokémon' }}
        </div>
      </div>

      <div class="hidden lg:flex flex-col items-end gap-1 xl:gap-2 text-right text-xs xl:text-sm uppercase tracking-[0.3em] xl:tracking-[0.4em] max-h-[70vh] overflow-y-auto overflow-x-hidden pr-2 scrollbar-hide">
        <div
          ref="verticalNavContainer"
          class="flex flex-col h-40 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide text-right"
        >
          <button
            v-for="number in baseNavigation"
            :key="number"
            type="button"
            class="py-0.5 text-right transition-colors hover:text-white focus:outline-none"
            :class="[
              number === pokemon.id
                ? 'text-white font-bold text-base xl:text-lg tracking-[0.4em]'
                : 'text-white/40 tracking-[0.35em]'
            ]"
            :aria-current="number === pokemon.id ? 'true' : undefined"
            :ref="(el) => setVerticalButtonRef(el, number)"
            @click="emit('select', number)"
          >
            {{ number.toString().padStart(3, '0') }}
          </button>
        </div>
        <div class="mt-4 xl:mt-6 flex flex-col items-center gap-3 xl:gap-4">
          <div class="h-10 w-10 xl:h-12 xl:w-12 rounded-full border border-white/30 flex items-center justify-center">
            <svg class="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M12 3c-1.5 3.5-4 4.5-4 7.5a4 4 0 0 0 8 0c0-3-2.5-4-4-7.5Z" />
              <path d="M12 21c3.5-2 5-5 5-7.5a5 5 0 1 0-10 0c0 2.5 1.5 5.5 5 7.5Z" />
            </svg>
          </div>
          <div class="text-[10px] xl:text-xs text-white/70 tracking-[0.2em] xl:tracking-[0.3em] rotate-180 writing-vertical">
            Pokédex · All Regions
          </div>
        </div>
      </div>
    </div>

    <nav
      ref="navContainer"
      class="border-t border-white/20 px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] overflow-x-auto scrollbar-hide"
    >
      <div class="flex gap-3 sm:gap-4 min-w-max">
        <button
          v-for="number in baseNavigation"
          :key="number"
          type="button"
          class="transition-colors hover:text-white focus:outline-none"
          :class="number === pokemon.id ? 'text-white font-bold' : 'text-white/50'"
          :aria-current="number === pokemon.id ? 'true' : undefined"
          :ref="(el) => setNavButtonRef(el, number)"
          @click="emit('select', number)"
        >
          {{ number.toString().padStart(3, '0') }}
        </button>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.writing-vertical {
  writing-mode: vertical-rl;
  text-transform: uppercase;
}
</style>
