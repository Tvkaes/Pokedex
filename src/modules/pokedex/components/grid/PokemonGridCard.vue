<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PokemonGridEntry } from '@/types/pokemon.types'
import PokemonTypeBadge from '@pokedex/components/shared/PokemonTypeBadge.vue'
import PokemonGridMegaToggleButton from './PokemonGridMegaToggleButton.vue'

const props = defineProps<{
  entry: PokemonGridEntry
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

const spriteMotion = computed(() => ({
  initial: {
    scale: 0.8,
    opacity: 0,
    y: 30,
    rotate: -4,
    filter: 'blur(12px)',
  },
  enter: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 18,
      mass: 0.8,
    },
  },
}))

const isMegaActive = ref(false)
const currentFormIndex = ref(0)
const alternateForms = computed(() => props.entry.alternateForms ?? [])
const hasMegaForm = computed(() => props.entry.hasMegaEvolution && alternateForms.value.length > 0)
const formStones = computed(() =>
  alternateForms.value
    .map((form, index) => ({ form, index }))
    .filter(({ form }) => Boolean(form.stone?.sprite))
)
const hasMultipleStones = computed(() => formStones.value.length > 1)
const pulseMode = ref<'mega' | 'base' | null>(null)
let pulseTimeout: ReturnType<typeof setTimeout> | null = null
const cryAudio = ref<HTMLAudioElement | null>(null)

const activeForm = computed(() => {
  if (!isMegaActive.value || !hasMegaForm.value) return null
  return alternateForms.value[currentFormIndex.value] ?? null
})

const displayName = computed(() => activeForm.value?.name ?? props.entry.name)
const displaySprite = computed(() => activeForm.value?.sprite ?? props.entry.sprite)
const displayType = computed(() => activeForm.value?.primaryType ?? props.entry.primaryType)
const displayFormattedId = computed(() => activeForm.value?.formattedId ?? props.entry.formattedId)
const activeStone = computed(() => {
  if (isMegaActive.value && hasMegaForm.value) {
    return activeForm.value?.stone ?? formStones.value[0]?.form.stone
  }
  return formStones.value[0]?.form.stone
})
const stoneSprite = computed(() => activeStone.value?.sprite ?? null)

function handleClick() {
  const targetId = activeForm.value?.id ?? props.entry.id
  emit('select', targetId)
}

function handleMegaToggle(targetIndex?: number) {
  if (!hasMegaForm.value) return
  const nextIndex =
    typeof targetIndex === 'number'
      ? targetIndex
      : (currentFormIndex.value + 1) % Math.max(alternateForms.value.length, 1)

  if (!isMegaActive.value || currentFormIndex.value !== nextIndex) {
    isMegaActive.value = true
    currentFormIndex.value = nextIndex
    triggerPulse('mega')
    playCry()
    return
  }

  isMegaActive.value = false
  currentFormIndex.value = 0
  triggerPulse('base')
  playCry()
}

watch(
  () => props.entry.id,
  () => {
    isMegaActive.value = false
    currentFormIndex.value = 0
    stopPulse()
  }
)

function triggerPulse(mode: 'mega' | 'base') {
  stopPulse()
  pulseMode.value = mode
  pulseTimeout = window.setTimeout(() => {
    pulseMode.value = null
    pulseTimeout = null
  }, 900)
}

function stopPulse() {
  if (pulseTimeout) {
    clearTimeout(pulseTimeout)
    pulseTimeout = null
  }
  pulseMode.value = null
}

onBeforeUnmount(() => {
  stopPulse()
  if (cryAudio.value) {
    cryAudio.value.pause()
    cryAudio.value = null
  }
})

function resolveCryUrl() {
  if (isMegaActive.value) {
    return activeForm.value?.cryUrl || props.entry.cryUrl
  }
  return props.entry.cryUrl
}

function playCry() {
  const cryUrl = resolveCryUrl()
  if (!cryUrl) return
  try {
    cryAudio.value?.pause()
    cryAudio.value = new Audio(cryUrl)
    cryAudio.value.currentTime = 0
    void cryAudio.value.play()
  } catch (error) {
    console.warn('Failed to play cry audio', error)
  }
}
</script>

<template>
  <button
    class="group relative flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-white/10 p-8 text-left text-surface-900 transition-transform duration-500 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    @click="handleClick"
  >
    
    <div class="watermark watermark-label pointer-events-none select-none">
      {{ entry.nativeName || entry.name }}
    </div>
    <div class="relative z-10 flex h-full flex-col gap-6">
      <div
        class="flex items-center gap-4"
        :class="{
          'justify-end': !hasMegaForm || !stoneSprite,
          'justify-between': hasMegaForm && stoneSprite,
        }"
      >
        <div
          v-if="hasMegaForm && formStones.length"
          class="flex items-center gap-2"
          :class="{ 'flex-wrap': hasMultipleStones }"
        >
          <PokemonGridMegaToggleButton
            v-for="{ form, index } in formStones"
            :key="`${entry.id}-${index}`"
            :is-visible="Boolean(form.stone?.sprite)"
            :is-mega-active="isMegaActive && currentFormIndex === index"
            :stone-sprite="form.stone?.sprite ?? undefined"
            :display-name="form.name"
            @toggle="() => handleMegaToggle(index)"
          />
        </div>
        <PokemonTypeBadge :label="displayType" />
      </div>

      <div class="grid flex-1 grid-cols-[1fr_auto] items-center gap-6">
        <div class="flex min-h-[240px] items-center justify-center">
          <div
            :key="entry.id"
            v-motion="spriteMotion"
            :class="[{ 'mega-pulse': pulseMode === 'mega', 'base-pulse': pulseMode === 'base' }]"
          >
            <img
              :src="displaySprite"
              :alt="displayName"
              class="h-48 w-48 object-contain drop-shadow-[0_20px_60px_rgba(56,189,248,0.35)]"
              loading="lazy"
            />
          </div>
        </div>
        <div class="vertical-text text-5xl font-bold tracking-widest text-white/70 leading-none">
          {{ entry.nativeName || displayName }}
        </div>
      </div>

      <div class="mt-auto pt-4 text-white">
        <div class="flex items-center gap-3">
          <p class="text-2xl font-light leading-none">#{{ displayFormattedId.replace('#', '') }}</p>
          <span
            v-if="isMegaActive && hasMegaForm"
            class="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em]"
          >
            Mega
          </span>
        </div>
        <p :class="['mt-2 transition-all duration-200', isMegaActive && hasMegaForm ? 'text-3xl' : 'text-4xl']">
          {{ displayName }}
        </p>
      </div>
    </div>
  </button>
</template>

<style scoped>
.watermark {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 160px;
  font-weight: 700;
  color: rgba(30, 58, 138, 0.05);
  line-height: 0.8;
}

.watermark-label {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 70px;
  margin-left: 24px;
  margin-top: 16px;
  letter-spacing: 0.4em;
  color: rgba(255, 255, 255, 0.1);
  filter: blur(3.5px);
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.25em;
}

.mega-pulse {
  animation: megaPulse 0.9s ease;
}

.base-pulse {
  animation: basePulse 0.9s ease;
}

@keyframes megaPulse {
  0% {
    transform: scale(0.9) rotate(-4deg);
    filter: drop-shadow(0 20px 60px rgba(56, 189, 248, 0.35));
  }
  50% {
    transform: scale(1.1) rotate(3deg);
    filter: drop-shadow(0 30px 80px rgba(6, 182, 212, 0.55));
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 20px 60px rgba(56, 189, 248, 0.35));
  }
}

@keyframes basePulse {
  0% {
    transform: scale(1.05) rotate(3deg);
    filter: drop-shadow(0 28px 70px rgba(56, 189, 248, 0.5));
  }
  50% {
    transform: scale(0.92) rotate(-3deg);
    filter: drop-shadow(0 18px 45px rgba(15, 118, 110, 0.45));
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 20px 60px rgba(56, 189, 248, 0.35));
  }
}
</style>
